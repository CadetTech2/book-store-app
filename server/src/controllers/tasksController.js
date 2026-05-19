const pool = require('../config/db');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getAllTasks = async (req, res, next) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
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
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: tasks[0],
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

    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), description || '', taskStatus, taskPriority, taskDueDate]
    );

    const [newTasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      data: newTasks[0],
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

    // Check if task exists
    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    const currentTask = existing[0];
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

    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?',
      [updatedTitle, updatedDescription, updatedStatus, updatedPriority, updatedDueDate, id]
    );

    const [updatedTasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      data: updatedTasks[0],
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

    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      id: parseInt(id, 10),
    });
  } catch (error) {
    next(error);
  }
};
