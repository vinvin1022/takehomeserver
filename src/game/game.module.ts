import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './game.service';
import { User } from './user.entity';
import { GameHistory } from './game-history.entity';
import { GameController } from './game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, GameHistory])],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}