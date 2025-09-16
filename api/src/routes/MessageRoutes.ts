import { Router } from "express";
import { createMessage } from "../controllers/MessageController";

const router = Router()

router.post('/message', createMessage)

export default router