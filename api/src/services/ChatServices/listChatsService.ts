import { Chat } from '../../models/Chat';

export const listChatsService = async (): Promise<Chat[]> => {
  const chats = await Chat.findAll();

  return chats;
};
