const { UserSettings, Repository, Task } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

/**
 * Get user settings
 */
const getSettings = async (req, res) => {
  let settings = await UserSettings.findOne({
    where: { user_id: req.user.id }
  });
  
  if (!settings) {
    settings = await UserSettings.create({ user_id: req.user.id });
  }
  
  res.json(settings);
};

/**
 * Update user settings
 */
const updateSettings = async (req, res) => {
  let settings = await UserSettings.findOne({
    where: { user_id: req.user.id }
  });
  
  if (!settings) {
    settings = await UserSettings.create({ user_id: req.user.id });
  }
  
  const allowedUpdates = [
    'theme',
    'default_view',
    'priority_weights',
    'custom_keywords',
    'notification_preferences',
    'export_preferences',
    'integrations',
    'default_sync_interval'
  ];
  
  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }
  
  await settings.update(updates);
  res.json(settings);
};

/**
 * Get user statistics
 */
const getStatistics = async (req, res) => {
  const [repositories, tasks] = await Promise.all([
    Repository.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'health_score', 'last_analyzed_at']
    }),
    Task.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'status', 'priority_score', 'category']
    })
  ]);
  
  const stats = {
    repositories: {
      total: repositories.length,
      average_health: repositories.length > 0
        ? repositories.reduce((sum, r) => sum + (r.health_score || 0), 0) / repositories.length
        : 0,
      analyzed: repositories.filter(r => r.last_analyzed_at).length
    },
    tasks: {
      total: tasks.length,
      open: tasks.filter(t => t.status === 'open').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      snoozed: tasks.filter(t => t.status === 'snoozed').length,
      by_category: {}
    },
    priority: {
      high: tasks.filter(t => t.priority_score >= 20).length,
      medium: tasks.filter(t => t.priority_score >= 10 && t.priority_score < 20).length,
      low: tasks.filter(t => t.priority_score < 10).length
    }
  };
  
  // Count tasks by category
  const categories = ['TODO', 'FIXME', 'BUG', 'SECURITY', 'INCOMPLETE_CODE'];
  for (const category of categories) {
    stats.tasks.by_category[category] = tasks.filter(t => t.category === category).length;
  }
  
  res.json(stats);
};

module.exports = {
  getSettings,
  updateSettings,
  getStatistics
};
