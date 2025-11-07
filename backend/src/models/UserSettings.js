module.exports = (sequelize, DataTypes) => {
  const UserSettings = sequelize.define('UserSettings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    theme: {
      type: DataTypes.ENUM('light', 'dark', 'auto'),
      defaultValue: 'auto'
    },
    default_view: {
      type: DataTypes.ENUM('list', 'kanban'),
      defaultValue: 'list'
    },
    priority_weights: {
      type: DataTypes.JSON,
      defaultValue: {
        critical_comments: 3,
        days_since_commit: 2,
        open_issues: 2,
        code_complexity: 1.5,
        security_vulnerability: 5,
        custom_priority: 1
      }
    },
    custom_keywords: {
      type: DataTypes.JSON,
      defaultValue: {
        TODO: ['TODO', 'todo', '@todo'],
        FIXME: ['FIXME', 'fixme', '@fixme'],
        BUG: ['BUG', 'bug', '@bug'],
        HACK: ['HACK', 'hack', '@hack'],
        XXX: ['XXX', 'xxx', '@xxx'],
        NOTE: ['NOTE', 'note', '@note'],
        OPTIMIZE: ['OPTIMIZE', 'optimize', '@optimize'],
        REVIEW: ['REVIEW', 'review', '@review']
      }
    },
    notification_preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        email_enabled: false,
        slack_enabled: false,
        discord_enabled: false,
        critical_only: true,
        daily_summary: false
      }
    },
    export_preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        default_format: 'json',
        include_metadata: true,
        include_code_snippets: true
      }
    },
    integrations: {
      type: DataTypes.JSON,
      defaultValue: {
        trello: { enabled: false, board_id: null, api_key: null, token: null },
        jira: { enabled: false, project_key: null, api_token: null },
        asana: { enabled: false, workspace_id: null, access_token: null }
      }
    },
    default_sync_interval: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    }
  }, {
    tableName: 'user_settings',
    indexes: [
      { fields: ['user_id'], unique: true }
    ]
  });

  return UserSettings;
};
