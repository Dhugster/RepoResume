module.exports = (sequelize, DataTypes) => {
  const Repository = sequelize.define('Repository', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    github_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clone_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stars: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    forks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    open_issues: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    default_branch: {
      type: DataTypes.STRING,
      defaultValue: 'main'
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_fork: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    health_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    health_metrics: {
      type: DataTypes.JSON,
      defaultValue: {
        code_coverage: 0,
        technical_debt_ratio: 0,
        dependency_freshness: 0,
        documentation_completeness: 0,
        test_reliability: 0
      }
    },
    last_commit_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_analyzed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_synced_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sync_interval_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'repositories',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['github_id'] },
      { fields: ['full_name'] },
      { fields: ['user_id', 'github_id'], unique: true }
    ]
  });

  return Repository;
};
