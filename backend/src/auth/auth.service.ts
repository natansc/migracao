import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

const SESSION_DURATION_MINUTES = 60;

@Injectable()
export class AuthService {
  private constRounds = 10;

  constructor(private readonly prisma: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.constRounds;
    return bcrypt.hash(password, saltRounds);
  }

  async validateUser(usernameOrEmail: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    const { password: _password, ...result } = user;
    return result;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    
    // Atualiza o último login do usuário
    await this.prisma.user.update({
      where: { username: user.username },
      data: { lastLogin: new Date() },
    });
    
    return user;
  }

  // Verifica se a sessão do usuário ainda é válida (baseado no último login)
  // A sessão expira após 1 hora (SESSION_DURATION_MINUTES = 60)
  async isSessionValid(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return false; // Usuário não existe
    }

    // Usa cast para acessar lastLogin, que pode não estar na tipagem atual
    // Após regenerar o Prisma client, este campo estará disponível
    const userWithLastLogin = user as any;

    if (!userWithLastLogin.lastLogin) {
      return false; // Nunca fez login
    }

    const lastLogin = userWithLastLogin.lastLogin.getTime();
    const now = new Date().getTime();
    const sessionAgeMinutes = (now - lastLogin) / (1000 * 60);

    // Sessão expira após 1 hora (60 minutos)
    return sessionAgeMinutes < SESSION_DURATION_MINUTES;
  }
}