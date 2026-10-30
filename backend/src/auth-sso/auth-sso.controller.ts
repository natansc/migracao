import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.guard';
import { UserRole } from '../auth/user-role';
import { PrismaService } from '../database/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.login(body.username, body.password);

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const tokenLocal = await this.jwtService.signAsync(payload);

    return {
      autorizado: true,
      accessToken: tokenLocal,
      usuario: {
        username: user.username,
        role: user.role,
      },
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { username: req.user.username },
      select: { id: true, username: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  listRoles() {
    return ['ADMIN', 'EDIT', 'VISUALIZACAO'];
  }
}