import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser(email, passwordHash);

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ success: true, message: 'User registered successfully', data: { token, email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, message: 'Login successful', data: { token, email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
