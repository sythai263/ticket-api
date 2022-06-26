import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
	private readonly reflector: Reflector;
	constructor(reflector: Reflector) {
		this.reflector = reflector;
	}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());

		if (!roles) {
			return true;
		}

		const user = context.switchToHttp().getRequest<UserEntity>();
		return roles.includes(user.role);
	}
}
