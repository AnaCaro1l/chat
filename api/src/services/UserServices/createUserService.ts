import { AppError } from "../../errors/AppError";
import { User } from "../../models/User";
import { UserSchema } from "./schemas";
import bcrypt from "bcrypt";

interface Request {
    name: string;
    email: string;
    password: string;
}

export const createUserService = async ({ name, email, password }: Request): Promise<User> => {
    await UserSchema.createUser.validate({ name, email, password });
    
    const userExists = await User.findOne({
        where: { email: email }
    })

    if (userExists) {
        throw new AppError("Esse email já está cadastrado")
    }

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
        name,
        email,
        passwordHash
    })

    return user;

}