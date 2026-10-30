import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DatabaseModule } from '../database/database.module';
import { AuthSsoModule } from '../auth-sso/auth-sso.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [DatabaseModule, AuthSsoModule],
})
export class ApiModule {}