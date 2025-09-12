import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

interface Request {
  email: string;
  password: string;
}

export const authUserService = async ({
  email,
  password,
}: Request): Promise<string> => {
  const user = await User.findOne({
    where: { email: email },
  });

  const checkPassword = await bcrypt.compare(password, user.passwordHash);

  if (!user.email || !checkPassword) {
    throw new AppError('Email ou senha incorretos');
  }

  const token = await sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    'secret',
    {
      expiresIn: '1d',
    }
  );

  return token;
};
