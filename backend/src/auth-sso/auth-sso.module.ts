import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth-sso.controller';
import { AzoAuthService } from './auth-sso.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'development-secret' }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AzoAuthService, JwtAuthGuard, RolesGuard],
  exports: [AzoAuthService, JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthSsoModule {}
