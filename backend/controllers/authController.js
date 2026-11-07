const authService = require('../services/authService');
const logger = require('../config/logger');

// 1. REGISTER
const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    logger.error(`Register Controller Error: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// 2. LOGIN
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Login Controller Error: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// 3. GET ME
const getMe = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    logger.error(`GetMe Controller Error: ${error.message}`);
    return res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
