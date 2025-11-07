module.exports = (sequelize, DataTypes) => {
  const Analysis = sequelize.define('Analysis', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    repository_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'repositories',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'running', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tasks_found: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    files_analyzed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lines_analyzed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    analysis_results: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    health_metrics: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'analyses',
    indexes: [
      { fields: ['repository_id'] },
      { fields: ['status'] },
      { fields: ['started_at'] }
    ]
  });

  return Analysis;
};
