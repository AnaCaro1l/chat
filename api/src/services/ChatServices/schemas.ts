import { number, object, string } from "yup";

export class ChatSchema {
    static createChat = object({
        ownerId: number().required(),
        recipientId: number().required("Voce deve colocar o destinatario do chat")
    })
}