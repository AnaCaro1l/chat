import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';

interface Request {
  name?: string;
  email: string;
  password?: string;
}

export const updateUserService = async (
  { name, email, password }: Request,
  id
): Promise<User> => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuário não encontrado');
  }

  if (password) {
    const isOldPassword = await bcrypt.compare(password, user.passwordHash);
    const saltRounds = 10;
    password = await bcrypt.hash(password, saltRounds);

    if (isOldPassword) {
      throw new AppError('A nova senha deve ser diferente da anterior');
    }
  }

  if (email === user.email) {
    throw new AppError('O novo email deve ser diferente do anterior');
  }

  const updatedUser = await user.update({
    name: name || user.name,
    email: email || user.email,
    passwordHash: password || user.passwordHash,
  });

  return updatedUser;
};
