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
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT, 10),
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
   
    GameModule
  ],
  providers: [ChatsocketGateway],
})
export class AppModule {}
