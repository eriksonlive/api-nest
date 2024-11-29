import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'vibroaire.com.co',
      port: 3306,
      username: 'u830777890_admin',
      password: 'Herd307jar$',
      database: 'u830777890_api',
      // entities: [__dirname + '/**/*entity{.ts, .js}'],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
