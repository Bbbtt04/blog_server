import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './utils/index';
import { UsersModule } from './modules/users/users.module';

import { ContentsModule } from './modules/contents/contents.module';
import { TagsModule } from './modules/tags/tags.module';
import { CategoryModule } from './modules/categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [getConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dataBase = configService.get('DATEBASE');
        return {
          type: dataBase.TYPE,
          host: dataBase.HOST,
          port: dataBase.PORT,
          username: dataBase.USERNAME,
          password: dataBase.PASSWORD,
          database: dataBase.DATEBASE,
          synchronize: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
    AuthModule,
    UsersModule,
    TagsModule,
    CategoryModule,
    ContentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
