import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../../entities/user.entity';
import { EventListener } from './events/mail.listener';
import { UserRepository } from './repositories/user.repo';
import { CreateUserUsecase } from './useCases/users/create/createUser.usecase';
import { DeleteUserUsecase } from './useCases/users/delete/deleteUser.usecase';
import { GetUserUseCase } from './useCases/users/get/userInfo.usecase';
import { ChangePasswordUseCase } from './useCases/users/update/changePassword.usecase';
import { ForgotPasswordUseCase } from './useCases/users/update/forgotPassword.usecase';
import { UpdateUserUseCase } from './useCases/users/update/updateUser.usecase';
import { UserController } from './useCases/users/user.controller';

@Module({
	imports: [
		HttpModule,
		TypeOrmModule.forFeature([UserEntity]),
		EventEmitterModule.forRoot()
	],
	controllers: [UserController],
	providers: [
		GetUserUseCase,
		UpdateUserUseCase,
		ChangePasswordUseCase,
		CreateUserUsecase,
		DeleteUserUsecase,
		ForgotPasswordUseCase,
		EventListener,
		{
			provide: 'UserRepository',
			useClass: UserRepository,
		},
	],
})
export class TicketModule {}
