const { encrypt, decrypt } = require('../utils/encryption');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    github_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    github_access_token: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const encrypted = this.getDataValue('github_access_token');
        if (!encrypted) return null;
        try {
          return decrypt(encrypted);
        } catch (error) {
          return encrypted; // Return as-is if decryption fails
        }
      },
      set(value) {
        if (value) {
          this.setDataValue('github_access_token', encrypt(value));
        }
      }
    },
    profile_data: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    last_login_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    indexes: [
      { fields: ['github_id'], unique: true },
      { fields: ['username'] },
      { fields: ['email'] }
    ]
  });

  return User;
};
