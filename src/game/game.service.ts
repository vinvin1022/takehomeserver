import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GameHistory } from './game-history.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(GameHistory)
    private gameHistoryRepository: Repository<GameHistory>,
  ) {}

  async findOrCreateUser(username: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      user = this.userRepository.create({ username });
      await this.userRepository.save(user);
    }
    return user;
  }

  async saveGameResult(username: string, result: 'win' | 'lose', presses: number) {
    const user = await this.findOrCreateUser(username);
    const gameHistory = this.gameHistoryRepository.create({
      result,
      presses,
      user,
    });
    await this.gameHistoryRepository.save(gameHistory);
  }

  async getUserHistory(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['history'],
    });
    return user || {};
  }
}