import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';
import chatRoutes from './routes/ChatRoutes';
import messageRoutes from './routes/MessageRoutes'
import { sequelize } from './database';
import { ValidationError } from 'yup';
import { AppError } from './errors/AppError';
import http from 'http'
import { Server } from 'socket.io'

const app = express();
const port = 3333;

app.use(cors());
app.use(express.json());

app.use('/', userRoutes);
app.use('/', chatRoutes);
app.use('/', messageRoutes)

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'validation error',
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);
});

const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('Um usuário conectou')
})


server.listen(port, () => console.log(`Server is running on port ${port}`))

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error(err);
  }
}

syncDb();
export default io