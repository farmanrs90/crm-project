const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured');
}

function generateToken(user) {
  const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function registerUserService({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('name, email and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

async function loginUserService({ email, password } = {}) {
  if (!email || !password) {
    throw new Error('email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const token = generateToken(user);
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}

module.exports = {
  registerUserService,
  loginUserService,
  generateToken
};