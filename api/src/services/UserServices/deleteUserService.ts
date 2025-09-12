import { User } from '../../models/User';

export const deleteUserService = async (id): Promise<void> => {
  await User.destroy({
    where: { id: id },
  });
};
