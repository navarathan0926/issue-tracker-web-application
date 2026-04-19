import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';
import { BCRYPT_SALT_ROUNDS, JWT_EXPIRES_IN } from '../utils/constants.js';
import type { RegisterInput, LoginInput, AuthResult } from '../types/index.js';

/**
 * Register a new user account.
 * Throws descriptive errors for validation failures.
 */
export const register = async (userData: RegisterInput): Promise<AuthResult> => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const userId = await userModel.createUser(email, hashedPassword);

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ userId, email }, secret, { expiresIn: JWT_EXPIRES_IN });

  return { token, user: { id: userId, email } };
};

/**
 * Authenticate a user with email + password.
 * Throws for invalid credentials (intentionally vague to prevent enumeration).
 */
export const login = async (credentials: LoginInput): Promise<AuthResult> => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: JWT_EXPIRES_IN });

  return { token, user: { id: user.id, email: user.email } };
};
