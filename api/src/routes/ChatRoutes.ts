import { Router } from "express";
import { addChat, deleteChat, getChats, showChat, updateChat } from "../controllers/ChatController";
import { isAuth } from "../middlewares/isAuth";

const router = Router()

router.post('/chat', isAuth, addChat)

router.get('/chat/:id', isAuth, showChat)

router.get('/chats', isAuth, getChats)

router.delete('/chat/:id', isAuth, deleteChat)

router.put('/chat/:id', isAuth, updateChat)

export default router