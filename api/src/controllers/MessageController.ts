import { Request, Response } from 'express';
import { createMessageService } from '../services/MessageServices/createMessageService';
import { listMessagesService } from '../services/MessageServices/listMessagesService';

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { body, chatId } = req.body;
    const userId = req.user.id
    const newMessage = await createMessageService({ body, chatId, userId });

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

export const listMessages = async(req: Request, res: Response) => {
    try{
        const { chatId } = req.body
        const userId = req.user.id
        const messages = await listMessagesService(chatId, userId)

        return res.status(201).json({
            messages
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: err.message
        })
    }
}