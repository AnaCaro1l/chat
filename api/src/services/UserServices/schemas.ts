import { object, string } from "yup";

export class UserSchema {
    static createUser = object({
        name: string().required("Name is required"),
        email: string().required("Email is required"),
        password: string().required("Password is required")
    })
}