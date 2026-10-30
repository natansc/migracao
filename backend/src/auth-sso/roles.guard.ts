import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { USER_ROLES, isValidRole, UserRole } from "./user-role";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user: any }).user;

    if (!user || !user.username) {
      throw new UnauthorizedException("Usuário não autenticado.");
    }

    const userRole: string = user.role;

    if (!isValidRole(userRole)) {
      throw new ForbiddenException("Perfil de usuário inválido.");
    }

    if (!requiredRoles.includes(userRole as UserRole)) {
      throw new ForbiddenException(
        `Acesso restrito ao perfil${requiredRoles.length > 1 ? "s" : ""} ${requiredRoles.join(", ")}.`,
      );
    }

    return true;
  }
}
