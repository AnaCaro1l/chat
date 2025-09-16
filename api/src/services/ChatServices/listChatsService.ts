import { Op } from 'sequelize';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';

export const listChatsService = async (id): Promise<Chat[]> => {
  const user = await User.findByPk(id);

  const chats = await Chat.findAll({
    where: {
      [Op.or]: [{ ownerId: user.id }, { recipientId: user.id }],
    },
  });

  return chats;
};
