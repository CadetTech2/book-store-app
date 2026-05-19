const sql = require('mssql');
const env = require('./env');
const fs = require('fs');
const path = require('path');

const config = {
  user: env.db.user,
  password: env.db.password,
  server: env.db.host,
  database: env.db.name,
  port: env.db.port,
  options: {
    encrypt: true, // Essential for Azure SQL Database
    trustServerCertificate: true, // For local dev. Set to false in prod with valid certificates.
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

async function initializeDatabase(pool) {
  try {
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      // Execute the schema to ensure table exists
      await pool.request().batch(schemaSql);
      console.log('Database schema verified/created successfully');
    }
  } catch (err) {
    console.error('Failed to initialize database schema:', err.message);
  }
}

const poolPromise = (async () => {
  let pool;
  try {
    // Attempt connection directly to the target database
    pool = await new sql.ConnectionPool(config).connect();
    console.log(`Database connected successfully to MS SQL Server [Database: ${config.database}]`);
    await initializeDatabase(pool);
    return pool;
  } catch (err) {
    // Error 4060 indicates the database doesn't exist
    if (err.number === 4060) {
      console.log(`Database '${config.database}' does not exist. Attempting to create it via master...`);
      try {
        const masterConfig = { ...config, database: 'master' };
        const masterPool = await new sql.ConnectionPool(masterConfig).connect();
        await masterPool.request().query(`CREATE DATABASE [${config.database}]`);
        await masterPool.close();
        console.log(`Database '${config.database}' created successfully.`);
        
        // Re-attempt connection to the target database
        pool = await new sql.ConnectionPool(config).connect();
        await initializeDatabase(pool);
        return pool;
      } catch (createErr) {
        console.error('Failed to auto-create database:', createErr.message);
        return null;
      }
    } else {
      console.error('Database connection failed:', err.message);
      return null;
    }
  }
})();

module.exports = {
  sql,
  poolPromise,
};
