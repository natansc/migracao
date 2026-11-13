import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ApiService {
  constructor(private readonly prisma: PrismaService) {}

  async listApi() {
    return this.prisma.apiIntegration.findMany({
      include: {
        users: true,
      },
    });
  }

  async getApi(id: number) {
    return this.prisma.apiIntegration.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  async createApi(body: {
    name: string;
    description: string;
    host: string;
    username: string;
    password: string;
    token: string;
    lastModifiedBy: string;
  }) {
    return this.prisma.apiIntegration.create({
      data: body,
    });
  }

  async updateApi(id: number, body: Partial<{
    name: string;
    description: string;
    host: string;
    username: string;
    password: string;
    token: string;
    lastModifiedBy: string;
  }>) {
    return this.prisma.apiIntegration.update({
      where: { id },
      data: body,
    });
  }

  async deleteApi(id: number) {
    return this.prisma.apiIntegration.delete({
      where: { id },
    });
  }
}