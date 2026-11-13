import { Module, OnModuleInit } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AdminSeedService } from './admin-seed.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AdminSeedService],
  exports: [UsersService],
})
export class UsersModule {}
