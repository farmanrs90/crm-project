const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  const payload = { id: user._id };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function registerUserService({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed });
  return { id: user._id, name: user.name, email: user.email };
}

async function loginUserService({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const token = generateToken(user);
  return { token, user: { id: user._id, name: user.name, email: user.email } };
}

module.exports = {
  registerUserService,
  loginUserService,
  generateToken
};