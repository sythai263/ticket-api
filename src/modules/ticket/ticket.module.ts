import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
	ProductEntity,
	ProgramEntity,
	UserEntity
} from '../../entities';
import { EventListener } from './events/mail.listener';
import {
	ProductRepository,
	ProgramRepository,
	UserRepository
} from './repositories';
import {
	CreateProductUsecase,
	DeleteProductUsecase,
	GetProductByIdUsecase,
	GetProductsUsecase,
	ProductController,
	UpdateProductUsecase
} from './useCases/products';
import {
	CreateProgramUsecase,
	DeleteProgramUsecase,
	GetProgramByIdUsecase,
	GetProgramsUsecase,
	ProgramController,
	UpdateProgramUsecase
} from './useCases/programs';
import {
	ChangePasswordUseCase,
	CreateUserUsecase,
	DeleteUserUsecase,
	ForgotPasswordUseCase,
	GetUserUseCase,
	UpdateUserUseCase,
	UserController
} from './useCases/users';

@Module({
	imports: [
		HttpModule,
		TypeOrmModule.forFeature([
			UserEntity,
			ProgramEntity,
			ProductEntity
		]),
		EventEmitterModule.forRoot()
	],
	controllers: [
		UserController,
		ProgramController,
		ProductController,
	],
	providers: [
		EventListener,
		GetUserUseCase,
		UpdateUserUseCase,
		ChangePasswordUseCase,
		CreateUserUsecase,
		DeleteUserUsecase,
		ForgotPasswordUseCase,
		CreateProgramUsecase,
		GetProgramsUsecase,
		GetProgramByIdUsecase,
		UpdateProgramUsecase,
		DeleteProgramUsecase,
		CreateProductUsecase,
		GetProductsUsecase,
		UpdateProductUsecase,
		DeleteProductUsecase,
		GetProductByIdUsecase,
		{
			provide: 'UserRepository',
			useClass: UserRepository,
		},
		{
			provide: 'ProgramRepository',
			useClass: ProgramRepository,
		},
		{
			provide: 'ProductRepository',
			useClass: ProductRepository,
		},
	],
})
export class TicketModule {}
