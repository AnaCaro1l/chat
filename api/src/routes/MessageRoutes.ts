import { Router } from "express";
import { createMessage, listMessages } from "../controllers/MessageController";

const router = Router()

router.post('/message', createMessage)

router.get('/messages', listMessages)

export default router