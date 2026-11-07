const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('./logger');

// Load environment variables from .env
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'group_chat',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    define: {
      underscored: true, // Automatically converts camelCase to snake_case (e.g. createdAt -> created_at)
      timestamps: true
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL Database connected successfully via Sequelize!');
  } catch (error) {
    logger.error(`Unable to connect to MySQL database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
