import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { DatabaseModule } from './database/database.module';
import { AuthSsoModule } from './auth-sso/auth-sso.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ApiModule, AuthSsoModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
