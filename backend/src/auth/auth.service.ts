import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private constRounds = 10;

  constructor(private readonly prisma: PrismaService) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
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
    return this.validateUser(username, password);
  }
}