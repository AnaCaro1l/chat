import { Router } from 'express'
import userRoutes from './routes/UserRoutes';
import chatRoutes from './routes/ChatRoutes';
import messageRoutes from './routes/MessageRoutes';

const routes = Router()

routes.use('/', userRoutes);
routes.use('/', chatRoutes);
routes.use('/', messageRoutes);

export default routes;