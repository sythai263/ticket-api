import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
	private readonly _reflector: Reflector;
	constructor(reflector: Reflector) {
		this._reflector = reflector;
	}

	canActivate(context: ExecutionContext): boolean {
		const roles = this._reflector.get<string[]>('roles', context.getHandler());

		if (!roles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = <UserEntity>request.user;
		return roles.includes(user.role);
	}
}
