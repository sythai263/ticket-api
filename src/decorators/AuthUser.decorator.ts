import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';

export const AuthUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) =>
		ctx.switchToHttp().getRequest<UserEntity>(),
);
