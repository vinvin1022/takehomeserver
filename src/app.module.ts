// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { ChatsocketGateway } from './chatsocket/chatsocket.gateway';

console.log(process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:[".env"]
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'database/takehome.db',
    //   // type: 'postgres',
    //   // host: process.env.DB_HOST,
    //   // port: parseInt(process.env.DB_PORT, 10),
    //   // username: process.env.DB_USERNAME,
    //   // password: process.env.DB_PASSWORD,
    //   // database: process.env.DB_DATABASE,
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: 'database/takehome.db',
          // type: 'postgres', // 根据需要设置数据库类型
          // host: configService.get<string>('DB_HOST'),
          // port: configService.get<number>('DB_PORT'),
          // username: configService.get<string>('DB_USERNAME'),
          // password: configService.get<string>('DB_PASSWORD'),
          // database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // 开发环境下可用，生产环境请设置为 false
        };
      },
      inject: [ConfigService],
    }),

    GameModule,
  ],
  providers: [ChatsocketGateway],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log(configService.get('DB_HOST'));
  }
}
