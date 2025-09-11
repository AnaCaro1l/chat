import { 
    Column, 
    DataType, 
    HasMany, 
    Model, 
    Table, 
    Unique 
} from 'sequelize-typescript';
import { Chat } from './Chat';

@Table
export class User extends Model<User> {
  @Column
  name: string;

  @Unique
  @Column(DataType.STRING(40))
  email: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @Column
  passwordHash: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @HasMany(() => Chat)
  chats: Chat[];
}
