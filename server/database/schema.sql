-- T-SQL Schema for Azure SQL Database / Microsoft SQL Server
-- Note: In Azure SQL, database is pre-created and USE statement is not supported.
-- Run this script inside your target database.

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tasks' AND type = 'U')
BEGIN
    CREATE TABLE tasks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        status NVARCHAR(50) NOT NULL DEFAULT 'pending',
        priority NVARCHAR(50) NOT NULL DEFAULT 'medium',
        due_date DATE DEFAULT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
