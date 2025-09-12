import { User } from '../../models/User';

export const deleteUserService = async (id): Promise<void> => {
  const user = await User.findByPk(id);

  await User.destroy({
    where: { id: id },
  });
};
