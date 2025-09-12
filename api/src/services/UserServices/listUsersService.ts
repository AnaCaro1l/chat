import { User } from "../../models/User"

export const listUsersService = async (): Promise<User[]> => {
    const users = await User.findAll()
    return users;
}