import { Router } from "express";
import { addChat, deleteChat, getChats, showChat } from "../controllers/ChatController";
import { isAuth } from "../middlewares/isAuth";

const router = Router()

router.post('/chat', isAuth, addChat)

router.get('/chat/:id', isAuth, showChat)

router.get('/chats/:id', isAuth, getChats)

router.delete('/chat/:id', isAuth, deleteChat)


export default router