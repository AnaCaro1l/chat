import { NextFunction, Request, Response } from 'express';
import { createUserService } from '../services/UserServices/createUserService';
import { listUsersService } from '../services/UserServices/listUsersService';
import { updateUserService } from '../services/UserServices/updateUserService';
import { deleteUserService } from '../services/UserServices/deleteUserService';
import { showUserService } from '../services/UserServices/showUserService';

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await createUserService({ name, email, password });
    return res.status(201).json({
      message: 'Usuario criado com sucesso',
      newUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  const users = await listUsersService();
  return res.status(200).json({
    message: 'Usuário listados com sucesso',
    users,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;

    const updatedUser = await updateUserService({ name, email, password }, id);
    return res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await deleteUserService(id);

    return res.status(201).json({
      message: 'Usuário deletado com sucesso',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const showUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await showUserService(id);

    return res.status(201).json({
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err.message,
    });
  }
};
