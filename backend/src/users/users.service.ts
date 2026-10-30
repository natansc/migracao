import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { USER_ROLES, isValidRole, UserRole } from '../auth-sso/user-role';

export interface CreateUserDto {
  username: string;
  email?: string;
  role: UserRole;
}

export interface UpdateUserDto {
  role?: UserRole;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureDefaultAdmin() {
    const adminUsername = 'natan.costa';
    const adminEmail = 'natan.costa@trinusco.com.br';

    let user = await this.prisma.user.findUnique({
      where: { username: adminUsername },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          role: 'ADMIN',
        },
      });
    } else if (user.role !== 'ADMIN') {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
      user = await this.prisma.user.findUnique({
        where: { id: user.id },
      });
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { username: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado.`);
    }

    return user;
  }

  async create(data: CreateUserDto) {
    if (!isValidRole(data.role)) {
      throw new BadRequestException(`Role inválido. Valores permitidos: ${USER_ROLES.join(', ')}.`);
    }

    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      throw new ConflictException(`Usuário '${data.username}' já existe.`);
    }

    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email || null,
        role: data.role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuário ${id} não encontrado.`);
    }

    if (data.role !== undefined && !isValidRole(data.role)) {
      throw new BadRequestException(`Role inválido. Valores permitidos: ${USER_ROLES.join(', ')}.`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.role !== undefined && { role: data.role }),
        ...(data.email !== undefined && { email: data.email }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuário ${id} não encontrado.`);
    }

    // Evita excluir o próprio admin default
    if (existing.username === 'natan.costa') {
      throw new BadRequestException('Não é possível excluir o administrador padrão natan.costa.');
    }

    await this.prisma.user.delete({ where: { id } });
    return { id, deleted: true };
  }
}
