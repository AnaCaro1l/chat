import { Request, Response } from 'express';
import { createChatService } from '../services/ChatServices/createChatService';
import { listChatsService } from '../services/ChatServices/listChatsService';
import { showChatService } from '../services/ChatServices/showChatService';
import { deleteChatService } from '../services/ChatServices/deleteChatService';

export const addChat = async (req: Request, res: Response) => {
  const { ownerId, email } = req.body;
  const chat = await createChatService({ ownerId, email });

  return res.status(201).json({
    message: 'Chat criado com sucesso!',
    chat,
  });
};

export const getChats = async (req: Request, res: Response) => {
  const id = req.params.id;
  const chats = await listChatsService(id);
  return res.status(200).json({
    message: 'Chats listados com sucesso!',
    chats,
  });
};

export const showChat = async (req: Request, res: Response) => {
  const id = req.params.id;
  const chat = await showChatService(id);

  return res.status(200).json({
    chat,
  });
};

export const deleteChat = async (req: Request, res: Response) => {
  const id = req.params.id;
  await deleteChatService(id);
  return res.status(204).json({
    message: 'Chat deletado com sucesso',
  });
};
