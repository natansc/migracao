import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { JwtAuthGuard } from '../auth-sso/jwt-auth.guard';
import { RolesGuard } from '../auth-sso/roles.guard';
import { Roles } from '../auth-sso/roles.guard';
import { UserRole } from '../auth-sso/user-role';

@Controller('api')
export class ApiController {
	constructor(private readonly apiService: ApiService) {}

	@Get('api-list')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.EDIT, UserRole.VISUALIZACAO)
	listApi() {
		return this.apiService.listApi();
	}

	@Get('api-get/:id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.EDIT, UserRole.VISUALIZACAO)
	getApi(@Param('id') id: string) {
		return this.apiService.getApi(Number(id));
	}

	@Post('api-create')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
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
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
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
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	deleteApi(@Param('id') id: string) {
		return this.apiService.deleteApi(Number(id));
	}
}
