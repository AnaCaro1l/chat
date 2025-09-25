import { Request, Response } from 'express';
import { User } from '../models/User';
import { authUserService } from '../services/UserServices/authUserService';
import { AppError } from '../errors/AppError';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email: email },
  });

  if (!user) {
    throw new AppError('User not found', 404)
  }

  const token = await authUserService({ email, password });

  return res.status(201).json({
    token,
    user,
  });
};
