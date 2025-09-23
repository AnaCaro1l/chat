import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { sequelize } from './database';
import { ValidationError } from 'yup';
import { AppError } from './errors/AppError';
import http from 'http';
import { Server } from 'socket.io';
import routes from './appRoutes';

const app = express();
const port = 3333;

app.use(routes);

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'validation error',
      message: err.message,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  console.log(err);
  return res.status(500).json({
    message: 'Internal server error',
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('Um usuário conectou');

  socket.on('register_user', (userId: number) => {
    console.log(`Usuário ${userId} registrado no socket ${socket.id}`);
    socket.join(`user_${userId}`);
  });

  socket.on('leave_chat', (chatId: number) => {
    socket.leave(`chat_${chatId}`);
    console.log(`Socket ${socket.id} saiu da sala chat_${chatId}`);
  });

  socket.on('join_chat', (chatId: number) => {
    socket.join(`chat_${chatId}`);
    console.log(`Socket ${socket.id} entrou na sala chat_${chatId}`);
  });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error(err);
  }
}

syncDb();
export default io;
