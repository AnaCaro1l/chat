import { Request, Response } from 'express';
import { createChatService } from '../services/ChatServices/createChatService';
import { listChatsService } from '../services/ChatServices/listChatsService';
import { showChatService } from '../services/ChatServices/showChatService';
import { updateChatService } from '../services/ChatServices/updateChatService';
import { deleteChatService } from '../services/ChatServices/deleteChatService';

export const addChat = async (req: Request, res: Response) => {
  try {
    const { ownerId, recipientId } = req.body;
    console.log(ownerId, recipientId);
    const chat = await createChatService({ ownerId, recipientId });

    return res.status(201).json({
      message: 'Chat criado com sucesso!',
      chat,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await listChatsService();
    return res.status(201).json({
      message: 'Chats listados com sucesso!',
      chats,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const showChat = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const chat = await showChatService(id);

    return res.status(201).json({
      chat,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateChat = async (req: Request, res: Response) => {
  try {
    const { ownerId, recipientId } = req.body;
    const id = req.params.id;

    const chat = await updateChatService({ ownerId, recipientId }, id);

    return res.status(201).json({
      message: 'Chat atualizado com sucesso',
      chat
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        await deleteChatService(id)
        return res.status(201).json({
            message: 'Chat deletado com sucesso'
        })
    } catch(err) {
        console.log(err)
        return res.status(400).json({
            message: err.message
        })
    }
}
