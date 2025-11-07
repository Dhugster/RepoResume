module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM(
        'TODO',
        'FIXME',
        'BUG',
        'HACK',
        'XXX',
        'NOTE',
        'OPTIMIZE',
        'REVIEW',
        'SECURITY',
        'INCOMPLETE_CODE',
        'FAILING_TEST',
        'OUTDATED_DEPENDENCY',
        'DOCUMENTATION',
        'REFACTOR',
        'OTHER'
      ),
      defaultValue: 'TODO'
    },
    priority_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    priority_factors: {
      type: DataTypes.JSON,
      defaultValue: {
        critical_comments: 0,
        days_since_commit: 0,
        open_issues: 0,
        code_complexity: 0,
        security_vulnerability: 0,
        custom_priority: 0
      }
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'completed', 'snoozed', 'cancelled'),
      defaultValue: 'open'
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    line_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    code_snippet: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    commit_sha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_commit_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_commit_author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_issues: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    related_prs: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    dependencies: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    suggested_next_steps: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    snoozed_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    custom_priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 10
      }
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'tasks',
    indexes: [
      { fields: ['repository_id'] },
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['category'] },
      { fields: ['priority_score'] },
      { fields: ['repository_id', 'status'] }
    ]
  });

  return Task;
};
