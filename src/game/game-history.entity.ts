import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  result: 'win' | 'lose';

  @Column()
  presses: number;

  @ManyToOne(() => User, (user) => user.history)
  user: User;
}