import { BelongsTo, Column, Default, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./User";
import { Message } from "./Message";

@Table
export class Chat extends Model<Chat> {

    @ForeignKey(() => User)
    @Column
    ownerId: number;

    @ForeignKey(() => User)
    @Column
    recipientId: number;

    @Default('')
    @Column
    lastMessage: string

    @Column
    createdAt: Date;

    @Column
    updatedAt: Date;

    @HasMany(() => Message)
    messages: Message[];

    @BelongsTo(() => User, 'ownerId')
    owner: User;

    @BelongsTo(() => User, 'recipientId')
    recipient: User;
}