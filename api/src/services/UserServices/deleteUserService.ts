import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';

export const deleteUserService = async (id): Promise<void> => {
  const user = await User.findByPk(id)

  if(!user) {
    throw new AppError("Usuário não encontrado")
  }
  await user.destroy()
};
