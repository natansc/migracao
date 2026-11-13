import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from '../users/users.service';


@Module({
  controllers: [ApiController],
  providers: [ApiService, UsersService],
  imports: [DatabaseModule],
})
export class ApiModule {}