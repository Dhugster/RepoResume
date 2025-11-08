require('dotenv').config();

const config = {
  development: {
    url: process.env.DATABASE_URL || 'sqlite:./database.sqlite',
    dialect: process.env.DATABASE_URL?.startsWith('postgres') ? 'postgres' : 'sqlite',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    url: 'sqlite::memory:',
    dialect: 'sqlite',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.DATABASE_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED !== 'false', // Default to true for security
        // For production, provide CA certificate:
        // ca: process.env.DATABASE_CA_CERT ? require('fs').readFileSync(process.env.DATABASE_CA_CERT) : undefined
      } : false
    }
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
