import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { JwtPayload } from '../modules/jwtAuth/jwtAuth.strategy';

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

		const request = context.switchToHttp().getRequest<Request>();
		const user = request.user as JwtPayload;
		return roles.includes(user.role);

	}
}
