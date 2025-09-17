import { Request, Response } from 'express';
import { createMessageService } from '../services/MessageServices/createMessageService';
import { listMessagesService } from '../services/MessageServices/listMessagesService';
import { deleteMessageService } from '../services/MessageServices/deleteMessageService';
import { updateMessageService } from '../services/MessageServices/updateMessageService';

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { body, chatId } = req.body;
    const userId = req.user.id;
    const message = await createMessageService({ body, chatId, userId });

    return res.status(201).json({
      message,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const listMessages = async (req: Request, res: Response) => {
  try {
    const chatId  = req.params.id;
    const userId = req.user.id;
    const messages = await listMessagesService(chatId, userId);

    return res.status(201).json({
      messages,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { id, body } = req.body;
    const userId = req.user.id;
    const updatedMessage = await updateMessageService({ id, body, userId });
    return res.status(200).json({
      updatedMessage,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await deleteMessageService(id);
    return res.status(201).json({
      message: 'Mensagem deletada com sucesso',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};
