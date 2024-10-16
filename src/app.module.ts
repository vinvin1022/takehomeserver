// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameModule } from './game/game.module';
import { ChatsocketGateway } from './chatsocket/chatsocket.gateway';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/takehome.db',
      // type: 'postgres',
      // host: "localhost",
      // port: 5432,
      // username: "postgres",
      // password: "123456",
      // database: "takehome",
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
   
    GameModule
  ],
  providers: [ChatsocketGateway],
})
export class AppModule {}
