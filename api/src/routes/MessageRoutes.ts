import { Router } from "express";
import { createMessage, listMessages } from "../controllers/MessageController";
import { isAuth } from "../middlewares/isAuth";

const router = Router()

router.post('/message', isAuth,createMessage)

router.get('/messages', isAuth, listMessages)

export default router