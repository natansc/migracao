import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { ApiIntegration, Prisma } from '@prisma/client';

@Injectable()
export class ApiService {
    constructor(private readonly prisma: PrismaService) {}

    async createApi(data: Prisma.ApiIntegrationCreateInput): Promise<Omit<ApiIntegration, 'password' | 'token'>> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        const hashedToken = await bcrypt.hash(data.token, saltRounds);

        const createdApi = await this.prisma.apiIntegration.create({
            data: { ...data, 
                password: hashedPassword,
                token: hashedToken
            },
        });
        const { password, token, ...result } = createdApi;

        return result;
    }

    async listApi() {
        return await this.prisma.apiIntegration.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                host: true,
                username: true,
                password: false,
                token: false,
                createdAt: true,
                updatedAt: true,
                lastModifiedBy: true,
            },
            orderBy: { name: 'asc' },
        });
    }
	async getApi(id: number): Promise<Omit<ApiIntegration, 'password' | 'token'>> {
		const api = await this.prisma.apiIntegration.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				description: true,
				host: true,
				username: true,
				password: false,
				token: false,
				createdAt: true,
				updatedAt: true,
				lastModifiedBy: true,
			},
		});

		if (!api) {
			throw new NotFoundException(`API integration ${id} not found`);
		}

		return api as Omit<ApiIntegration, 'password' | 'token'>;
	}

	async updateApi(
		id: number,
		data: Partial<{
			name: string;
			description: string;
			host: string;
			username: string;
			password: string;
			token: string;
			lastModifiedBy: string;
		}>,
	): Promise<Omit<ApiIntegration, 'password' | 'token'>> {
		const existing = await this.prisma.apiIntegration.findUnique({ where: { id } });
		if (!existing) {
			throw new NotFoundException(`API integration ${id} not found`);
		}

		const updateData: Prisma.ApiIntegrationUpdateInput = {};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined) updateData.description = data.description;
		if (data.host !== undefined) updateData.host = data.host;
		if (data.username !== undefined) updateData.username = data.username;
		if (data.lastModifiedBy !== undefined) updateData.lastModifiedBy = data.lastModifiedBy;

		if (data.password) {
			updateData.password = await bcrypt.hash(data.password, 10);
		}
		if (data.token) {
			updateData.token = await bcrypt.hash(data.token, 10);
		}

		const updated = await this.prisma.apiIntegration.update({
			where: { id },
			data: updateData,
		});

		const { password, token, ...result } = updated;
		return result;
	}

	async deleteApi(id: number): Promise<{ id: number; deleted: true }> {
		const existing = await this.prisma.apiIntegration.findUnique({ where: { id } });
		if (!existing) {
			throw new NotFoundException(`API integration ${id} not found`);
		}

		await this.prisma.apiIntegrationUser.deleteMany({ where: { apiIntegrationId: id } });
		await this.prisma.apiIntegration.delete({ where: { id } });

		return { id, deleted: true };
	}

}