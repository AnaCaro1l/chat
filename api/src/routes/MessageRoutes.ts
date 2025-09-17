import { Router } from "express";
import { createMessage, deleteMessage, listMessages, updateMessage } from "../controllers/MessageController";
import { isAuth } from "../middlewares/isAuth";

const router = Router()

router.post('/message', isAuth,createMessage)

router.get('/messages/:id', isAuth, listMessages)

router.delete('/message/:id', isAuth, deleteMessage)

router.put('/message', isAuth, updateMessage)

export default router