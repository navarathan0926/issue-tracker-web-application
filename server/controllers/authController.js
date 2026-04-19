import * as authService from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const { token, user } = await authService.register(req.body);
        res.status(201).json({ success: true, message: 'User registered successfully', data: { token, user } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { token, user } = await authService.login(req.body);
        res.status(200).json({ success: true, message: 'Login successful', data: { token, user } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
