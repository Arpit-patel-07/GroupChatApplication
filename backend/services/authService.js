const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../config/logger');

// 1. REGISTER USER SERVICE
const registerUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error('Email is already registered.');
  }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    throw new Error('Username is already taken.');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password_hash
  });

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  logger.info(`AuthService: Registered user "${user.username}" (ID: ${user.id})`);

  return {
    message: 'User registered successfully',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
};

// 2. LOGIN USER SERVICE
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Please provide both email and password.');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  logger.info(`AuthService: Logged in user "${user.username}" (ID: ${user.id})`);

  return {
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
};

// 3. GET USER BY ID
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'username', 'email']
  });
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
