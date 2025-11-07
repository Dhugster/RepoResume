const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Initialize Sequelize
const sequelize = new Sequelize(config.url, {
  dialect: config.dialect,
  logging: config.logging,
  define: config.define,
  pool: config.pool,
  dialectOptions: config.dialectOptions
});

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Repository = require('./Repository')(sequelize, Sequelize.DataTypes);
const Task = require('./Task')(sequelize, Sequelize.DataTypes);
const Analysis = require('./Analysis')(sequelize, Sequelize.DataTypes);
const UserSettings = require('./UserSettings')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Repository, { foreignKey: 'user_id', as: 'repositories' });
Repository.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Repository.hasMany(Task, { foreignKey: 'repository_id', as: 'tasks' });
Task.belongsTo(Repository, { foreignKey: 'repository_id', as: 'repository' });

Repository.hasMany(Analysis, { foreignKey: 'repository_id', as: 'analyses' });
Analysis.belongsTo(Repository, { foreignKey: 'repository_id', as: 'repository' });

User.hasOne(UserSettings, { foreignKey: 'user_id', as: 'settings' });
UserSettings.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Repository,
  Task,
  Analysis,
  UserSettings
};
