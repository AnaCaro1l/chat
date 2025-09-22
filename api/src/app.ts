import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';
import chatRoutes from './routes/ChatRoutes';
import messageRoutes from './routes/MessageRoutes';
import { sequelize } from './database';
import { ValidationError } from 'yup';
import { AppError } from './errors/AppError';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 3333;

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/', userRoutes);
app.use('/', chatRoutes);
app.use('/', messageRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // fallback pra erros não tratados
  console.error(err);
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
  })

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
