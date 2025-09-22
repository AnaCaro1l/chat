import { object, string } from "yup";

export class UserSchema {
    static createUser = object({
        name: string().required(),
        email: string().required().email("Invalid email"),
        password: string().required()
    })
}