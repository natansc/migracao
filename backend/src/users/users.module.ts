import { Module, OnModuleInit } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { AuthSsoModule } from '../auth-sso/auth-sso.module';

@Module({
  imports: [DatabaseModule, AuthSsoModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    // Garante que o admin padrão natan.costa exista no banco local
    await this.usersService.ensureDefaultAdmin();
  }
}
