import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';

export const register = async (userData) => {
    const { username, password } = userData;

    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({ username, password: hashedPassword });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: userId, username } };
};

export const login = async (credentials) => {
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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, username: user.username } };
};
