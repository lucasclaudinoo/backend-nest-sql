import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { users } from './auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: [users],
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
