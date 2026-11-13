import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const adminUsername = 'admin';
    const adminEmail = 'admin@exemplo.com';
    const defaultPassword = 'Sup@2022';
    const saltRounds = 12;

    try {
      // Verificar se o usuário admin já existe
      const existingAdmin = await this.prisma.user.findUnique({
        where: { username: adminUsername },
      });

      if (existingAdmin) {
        console.log('Usuário admin já existe no banco de dados.');
        return;
      }

      // Hash da senha com bcrypt (salt 12)
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      // Criar o usuário admin
      const adminUser = await this.prisma.user.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          role: 'ADMIN',
          password: hashedPassword,
        },
      });

      console.log(`Usuario admin criado com sucesso: ${adminUser.username} (role: ${adminUser.role})`);
    } catch (error) {
      console.error(
        'Erro ao criar usuario admin default:',
        error instanceof Error ? error.message : String(error),
      );
      // Nao lancamos o erro para nao derrubar a aplicacao
    }
  }
}