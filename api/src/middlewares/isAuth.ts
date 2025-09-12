import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { verify } from 'jsonwebtoken';

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Sessão expirada');
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new AppError('Token inválido');
  }

  try {
    const decode = verify(token, 'secret');
  } catch (err) {
    throw new AppError('Token inválido');
  }
  return next();
};
