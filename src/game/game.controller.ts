import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('history/:username')
  async getUserHistory(@Param('username') username: string) {
    return await this.gameService.getUserHistory(username);
  }
  @Get()
  getHello(): string {
    return "heelo";
  }
}