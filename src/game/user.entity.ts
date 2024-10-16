import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GameHistory } from './game-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @OneToMany(() => GameHistory, (history) => history.user, { cascade: true })
  history: GameHistory[];
}