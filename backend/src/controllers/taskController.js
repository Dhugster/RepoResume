const { Task, Repository } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

/**
 * Get all tasks for authenticated user
 */
const getTasks = async (req, res) => {
  const { status, category, repository_id } = req.query;
  
  const where = { user_id: req.user.id };
  
  if (status) where.status = status;
  if (category) where.category = category;
  if (repository_id) where.repository_id = repository_id;
  
  const tasks = await Task.findAll({
    where,
    include: [{
      model: Repository,
      as: 'repository',
      attributes: ['id', 'name', 'full_name']
    }],
    order: [['priority_score', 'DESC']]
  });
  
  res.json(tasks);
};

/**
 * Get task by ID
 */
const getTask = async (req, res) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      user_id: req.user.id
    },
    include: [{
      model: Repository,
      as: 'repository'
    }]
  });
  
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  
  res.json(task);
};

/**
 * Update task
 */
const updateTask = async (req, res) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      user_id: req.user.id
    }
  });
  
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  
  const allowedUpdates = [
    'status',
    'custom_priority',
    'user_notes',
    'tags'
  ];
  
  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }
  
  await task.update(updates);
  res.json(task);
};

/**
 * Mark task as complete
 */
const completeTask = async (req, res) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      user_id: req.user.id
    }
  });
  
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  
  await task.update({
    status: 'completed',
    completed_at: new Date()
  });
  
  res.json(task);
};

/**
 * Snooze task
 */
const snoozeTask = async (req, res) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      user_id: req.user.id
    }
  });
  
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  
  const { until } = req.body;
  
  if (!until) {
    throw new ApiError(400, 'Snooze date required');
  }
  
  await task.update({
    status: 'snoozed',
    snoozed_until: new Date(until)
  });
  
  res.json(task);
};

/**
 * Delete task
 */
const deleteTask = async (req, res) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      user_id: req.user.id
    }
  });
  
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  
  await task.destroy();
  res.json({ message: 'Task deleted successfully' });
};

module.exports = {
  getTasks,
  getTask,
  updateTask,
  completeTask,
  snoozeTask,
  deleteTask
};
