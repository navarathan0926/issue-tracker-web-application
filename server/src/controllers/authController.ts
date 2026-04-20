import type { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import type { RegisterInput, LoginInput } from '../types/index.js';

export const register = async (req: Request<object, object, RegisterInput>, res: Response): Promise<void> => {
  try {
    const { token, user } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { token, user },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ success: false, message });
  }
};

export const login = async (req: Request<object, object, LoginInput>, res: Response): Promise<void> => {
  try {
    const { token, user } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(400).json({ success: false, message });
  }
};
