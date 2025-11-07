const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const repositoryRoutes = require('./repositories');
const taskRoutes = require('./tasks');
const userRoutes = require('./users');
const exportRoutes = require('./export');

// Mount routes
router.use('/auth', authRoutes);
router.use('/repositories', repositoryRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/export', exportRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'RepoResume API',
    version: '1.0.0',
    description: 'Intelligent GitHub Repository Analyzer API',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      repositories: '/api/repositories',
      tasks: '/api/tasks',
      users: '/api/users',
      export: '/api/export'
    }
  });
});

module.exports = router;
