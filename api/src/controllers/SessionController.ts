import { Request, Response } from 'express';
import { User } from '../models/User';
import { authUserService } from '../services/UserServices/authUserService';

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email: email },
    });

    const token = await authUserService({ email, password });

    return res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};
