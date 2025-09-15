import { number, object, string } from "yup";

export class ChatSchema {
    static createChat = object({
        ownerId: number().required(),
        email: string().required("Voce deve colocar o email do destinatario")
    })
}