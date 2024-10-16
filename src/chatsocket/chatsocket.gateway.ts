import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game/game.service';

interface Player {
  id: string;
  team: 'left' | 'right';
  username: string;
  presses: number;
}

@WebSocketGateway({
  namespace: "/game",
  cors: {
    origin: 'http://localhost:3000', // 替换为你的前端URL
    credentials: true,
  }
})
export class ChatsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private players: Player[] = [];
  private ropePosition = 0;
  private threshold = 10;
  private countdown = 5; // 设置倒计时秒数

  constructor(private gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.players = this.players.filter(player => player.id !== client.id);
  }
  /**
   * 加入游戏
   * @param client 
   * @param data 
   */
  @SubscribeMessage('joinGame')
  async handleJoinGame(client: Socket, data: { username: string; team: 'left' | 'right' }) {
    console.log(`joinGame: ${JSON.stringify(data)}`)
    const player: Player = { id: client.id, team: data.team, username: data.username, presses: 0 };
    this.players.push(player);
    client.emit('gameJoined', { success: true, team: data.team });
    await this.gameService.findOrCreateUser(data.username);
    this.server.emit('updatePlayers', this.players);

    if (this.players.filter(p => p.team === 'left').length >= 1 && this.players.filter(p => p.team === 'right').length >= 1) {
      this.startCountdown();
    }
  }

  /**
   * 倒计时
   */
  async startCountdown() {
    let currentCountdown = this.countdown;
    
    const countdownInterval = setInterval(() => {
      this.server.emit('countdown', currentCountdown);
      currentCountdown -= 1;
      if (currentCountdown < 0) {
        clearInterval(countdownInterval);
        this.startGame();
      }
    }, 1000);
  }

  /**
   * 开始游戏
   */
  startGame() {
    this.server.emit('gameStart');
    this.server.emit('updateRope', { position: this.ropePosition });
  }

  /**
   * 按压
   * @param client 
   */
  @SubscribeMessage('press')
  handlePress(client: Socket) {
    const player = this.players.find(p => p.id === client.id);
    if (player) {
      player.presses += 1;
      this.ropePosition += player.team === 'left' ? -1 : 1;
      this.server.emit('updateRope', { position: this.ropePosition });

      if (Math.abs(this.ropePosition) >= this.threshold) {
        const winningTeam = this.ropePosition > 0 ? 'right' : 'left';
        this.endGame(winningTeam);
      }
    }
  }

  /**
   * 结束游戏
   * @param winningTeam 
   */
  async endGame(winningTeam: 'left' | 'right') {
    this.players.forEach(async player => {
      console.log(`player: ${JSON.stringify(player)}`)
      const result = player.team === winningTeam ? 'win' : 'lose';
      await this.gameService.saveGameResult(player.username, result, player.presses);
    });
    this.server.emit('gameEnd', { winningTeam });
    this.players = [];
  }
}