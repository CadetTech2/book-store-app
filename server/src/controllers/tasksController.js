const { sql, poolPromise } = require('../config/db');

// Helper to check pool connection
const checkPool = (pool, res) => {
  if (!pool) {
    res.status(500).json({
      success: false,
      message: 'Database connection is currently unavailable. Please verify SQL Server is running.',
    });
    return false;
  }
  return true;
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getAllTasks = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    if (!checkPool(pool, res)) return;

    const result = await pool.request().query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    if (!checkPool(pool, res)) return;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM tasks WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const taskStatus = status || 'pending';
    const taskPriority = priority || 'medium';
    const taskDueDate = due_date || null;

    const pool = await poolPromise;
    if (!checkPool(pool, res)) return;

    const result = await pool.request()
      .input('title', sql.NVarChar(255), title.trim())
      .input('description', sql.NVarChar(sql.MAX), description || '')
      .input('status', sql.NVarChar(50), taskStatus)
      .input('priority', sql.NVarChar(50), taskPriority)
      .input('due_date', sql.Date, taskDueDate)
      .query(`
        INSERT INTO tasks (title, description, status, priority, due_date)
        OUTPUT inserted.*
        VALUES (@title, @description, @status, @priority, @due_date)
      `);

    res.status(201).json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    const pool = await poolPromise;
    if (!checkPool(pool, res)) return;

    // Check if task exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM tasks WHERE id = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    const currentTask = checkResult.recordset[0];
    const updatedTitle = title !== undefined ? title.trim() : currentTask.title;
    const updatedDescription = description !== undefined ? description : currentTask.description;
    const updatedStatus = status !== undefined ? status : currentTask.status;
    const updatedPriority = priority !== undefined ? priority : currentTask.priority;
    const updatedDueDate = due_date !== undefined ? due_date : currentTask.due_date;

    if (!updatedTitle) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty',
      });
    }

    const updateResult = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar(255), updatedTitle)
      .input('description', sql.NVarChar(sql.MAX), updatedDescription || '')
      .input('status', sql.NVarChar(50), updatedStatus)
      .input('priority', sql.NVarChar(50), updatedPriority)
      .input('due_date', sql.Date, updatedDueDate)
      .query(`
        UPDATE tasks 
        SET title = @title, description = @description, status = @status, priority = @priority, due_date = @due_date, updated_at = GETDATE()
        OUTPUT inserted.*
        WHERE id = @id
      `);

    res.status(200).json({
      success: true,
      data: updateResult.recordset[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    if (!checkPool(pool, res)) return;

    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM tasks WHERE id = @id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM tasks WHERE id = @id');

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      id: parseInt(id, 10),
    });
  } catch (error) {
    next(error);
  }
};
