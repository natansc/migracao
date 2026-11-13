import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { ApiService } from './api.service';
import { UsersService } from '../users/users.service';

@Controller('api')
export class ApiController {
	constructor(
		private readonly apiService: ApiService,
		private readonly usersService: UsersService
	) {}

	@Get('api-list')
	listApi() {
		return this.apiService.listApi();
	}

	@Get('api-get/:id')
	getApi(@Param('id') id: string) {
		return this.apiService.getApi(Number(id));
	}

	@Post('api-create')
	createApi(
		@Body() body: {
			name: string;
			description: string;
			host: string;
			username: string;
			password: string;
			token: string;
			lastModifiedBy: string;
		},
	) {
		return this.apiService.createApi(body);
	}

	@Put('api-update/:id')
	updateApi(
		@Param('id') id: string,
		@Body() body: Partial<{
			name: string;
			description: string;
			host: string;
			username: string;
			password: string;
			token: string;
			lastModifiedBy: string;
		}>,
	) {
		return this.apiService.updateApi(Number(id), body);
	}

	@Delete('api-delete/:id')
	deleteApi(@Param('id') id: string) {
		return this.apiService.deleteApi(Number(id));
	}
@Post('ApiUser')
async createAdminUser(@Body() body: { email?: string }) {
	const adminUsername = 'admin';
	const adminRole = 'admin';
	const defaultPassword = 'Sup@2022';
	const defaultEmail = body.email || 'admin@example.com';

	// Verificar se o usuário admin já existe
	const existingUser = await this.usersService.findOneByUsername(adminUsername);

	if (existingUser) {
		return {
			success: false,
			message: 'Usuário admin já existe.',
			user: existingUser
		};
	}

	// Criar o usuário admin se não existir
	const newUser = await this.usersService.create({
		username: adminUsername,
		email: defaultEmail,
		password: defaultPassword,
		role: adminRole
	});

	return {
		success: true,
		message: 'Usuário admin criado com sucesso.',
		user: newUser
	};
}
}
