import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Chat } from './Chat';

@Table
export class Message extends Model<Message> {
  @Column
  body: string;

  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @Column
  fromUser: number;

  @Column(DataType.VIRTUAL)
  fromMe: boolean;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @BelongsTo(() => Chat)
  chat: Chat;
}
