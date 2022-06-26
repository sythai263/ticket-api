import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../../entities/user.entity';
import { JwtAuthModule } from '../jwtAuth/jwtAuth.module';
import { UserAuthRepository } from '../user/user.repo';
import { GetUserUseCase } from '../user/user.usecase';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { GoogleStrategy } from './google-auth.strategy';

@Module({
	imports: [JwtAuthModule, TypeOrmModule.forFeature([UserEntity])],
	providers: [
		GoogleAuthService,
		GoogleStrategy,
		GetUserUseCase,
		{
			provide: 'IUserAuthRepo',
			useClass: UserAuthRepository,
		},
	],
	controllers: [GoogleAuthController],
})
export class GoogleAuthModule {}
