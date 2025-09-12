import { Router } from 'express';
import {
  addUser,
  deleteUser,
  listUsers,
  showUser,
  updateUser,
} from '../controllers/UserController';
import { login } from '../controllers/SessionController';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.post('/user', addUser);

router.get('/users', isAuth, listUsers);

router.get('/user/:id', isAuth, showUser);

router.put('/user/:id', isAuth, updateUser);

router.delete('/user/:id', isAuth, deleteUser);

router.post('/login', login);

export default router;
