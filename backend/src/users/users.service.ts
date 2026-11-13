import { Injectable, NotFoundException, ConflictException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/auth.service';

export interface CreateUserDto {
  username: string;
  email?: string;
  password: string;
  role?: string;
}

export interface UpdateUserDto {
  role?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    // Garante que o admin padrão seja criado quando o serviço for inicializado
    await this.ensureDefaultAdmin();
  }

  async ensureDefaultAdmin() {
    const adminUsername = 'natan.costa';
    const adminEmail = 'natan.costa@trinusco.com.br';

    // Define a senha padrão para o primeiro admin
    const defaultPassword = 'Sup@2022S';

    let user = await this.prisma.user.findUnique({
      where: { username: adminUsername },
    });

    if (!user) {
      const hashedPassword = await this.authService.hashPassword(defaultPassword);
      user = await this.prisma.user.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          role: 'ADMIN',
          password: hashedPassword,
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
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado.`);
    }

    return user;
  }

  async findOneByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      throw new ConflictException(`Usuário '${data.username}' já existe.`);
    }

    // Hash da senha antes de salvar
    const hashedPassword = await this.authService.hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email || null,
        role: data.role,
        password: hashedPassword,
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

    // Se estiver atualizando senha, faz hash da nova senha
    let updateData: any = { ...(data.role !== undefined && { role: data.role }), ...(data.email !== undefined && { email: data.email }) };

    if (data.password) {
      updateData.password = await this.authService.hashPassword(data.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
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

    // Evita excluir o admin default
    if (existing.username === 'natan.costa') {
      throw new BadRequestException('Não é possível excluir o administrador padrão natan.costa.');
    }

    await this.prisma.user.delete({ where: { id } });
    return { id, deleted: true };
  }
}