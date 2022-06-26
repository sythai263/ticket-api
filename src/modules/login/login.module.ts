import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../../entities/user.entity';
import { JwtAuthModule } from '../jwtAuth/jwtAuth.module';
import { UserAuthRepository } from '../user/user.repo';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
	imports: [JwtAuthModule, TypeOrmModule.forFeature([UserEntity])],
	controllers: [LoginController],
	providers: [
		LoginService,
		{
			provide: 'IUserAuthRepo',
			useClass: UserAuthRepository,
		},
	],
})
export class LoginModule {}
