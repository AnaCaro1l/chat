import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';

export const showUserService = async (id): Promise<User> => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('O usuário não existe');
  }
  return user;
};
