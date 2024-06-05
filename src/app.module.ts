import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { users } from './auth/entities/user.entity';
import { Organization } from './organizations/entities/organization.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: [users, Organization],
      synchronize: true,
    }),
    AuthModule,
    OrganizationsModule,
  ],
})
export class AppModule {}
