import { Router } from 'express';
import { addUser, deleteUser, listUsers, updateUser } from '../controllers/UserController';

const router = Router();

router.post('/user', addUser);

router.get('/users', listUsers);

router.put('/user/:id', updateUser);

router.delete('/user/:id', deleteUser)

export default router;
