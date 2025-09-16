import { Request, Response } from 'express';
import { createMessageService } from '../services/MessageServices/createMessageService';

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { body, chatId } = req.body;
    const newMessage = await createMessageService({ body, chatId });

    return res.status(201).json({
      message: 'Mensagem enviada',
      newMessage,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};
