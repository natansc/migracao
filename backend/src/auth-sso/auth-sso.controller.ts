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
import { AzoAuthService } from './auth-sso.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.guard';
import { USER_ROLES, UserRole } from './user-role';
import { PrismaService } from '../database/prisma.service';


// DTO para validar a entrada do formulário
export class LoginDto {
  username: string;
  pass: string;
}

const USER_ROLES_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  EDIT: 'Editor',
  VISUALIZACAO: 'Visualização',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly azoAuthService: AzoAuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const azoData = await this.azoAuthService.autenticar(body.username, body.pass);

    if (!azoData.autorizado) {
      return { autorizado: false };
    }

    // Busca o usuário cadastrado localmente (pela plataforma de migração)
    const user = await this.prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user) {
      throw new ForbiddenException(
        'Usuário não cadastrado na plataforma de migração. Procure o administrador.',
      );
    }

    const payload = {
      sub: body.username,
      username: body.username,
      role: user.role,
    };

    const tokenLocal = await this.jwtService.signAsync(payload);

    return {
      autorizado: true,
      accessToken: tokenLocal,
      usuario: {
        username: body.username,
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
    return USER_ROLES.map((r) => ({ value: r, label: USER_ROLES_LABELS[r] }));
  }
}