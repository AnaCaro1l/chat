import { Request, Response } from 'express';
import { createMessageService } from '../services/MessageServices/createMessageService';
import { listMessagesService } from '../services/MessageServices/listMessagesService';
import { deleteMessageService } from '../services/MessageServices/deleteMessageService';
import { updateMessageService } from '../services/MessageServices/updateMessageService';

export const createMessage = async (req: Request, res: Response) => {
  const { body, chatId } = req.body;
  const userId = req.user.id;
  const message = await createMessageService({ body, chatId, userId });

  return res.status(201).json({
    message,
  });
};

export const listMessages = async (req: Request, res: Response) => {
  const chatId = req.params.id;
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  const userId = req.user.id;
  const messages = await listMessagesService({
    chatId,
    userId,
    page: page ? Number(page) : 0,
    pageSize: pageSize ? Number(pageSize) : 20,
  });

  return res.status(200).json({
    messages,
  });
};

export const updateMessage = async (req: Request, res: Response) => {
  const { id, body } = req.body;
  const userId = req.user.id;
  const updatedMessage = await updateMessageService({ id, body, userId });
  return res.status(200).json({
    updatedMessage,
  });
};

export const deleteMessage = async (req: Request, res: Response) => {
  const id = req.params.id;
  await deleteMessageService(id);
  return res.status(204).json({
    message: 'Mensagem deletada com sucesso',
  });
};
