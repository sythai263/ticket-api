import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
	AttendeeEntity,
	InvoiceEntity,
	ProductEntity,
	ProgramEntity,
	ProgramItemEntity,
	UserEntity
} from '../../entities';
import { EventListener } from './events/event.listener';
import {
	AttendeeRepository,
	InvoiceRepository,
	ProductRepository,
	ProgramItemRepository,
	ProgramRepository,
	UserRepository
} from './repositories';
import { AttendeeController, CreateAttendeeUsecase, GetAttendeeUsecase } from './useCases/attendee';
import {
	CreateProductUsecase,
	DeleteProductUsecase,
	GetProductByIdUsecase,
	GetProductsUsecase,
	ProductController,
	UpdateProductUsecase
} from './useCases/products';
import { CreateProgramItemUsecase, DeleteProgramItemByProgramIdUsecase, DeleteProgramItemUsecase, GetProgramItemUsecase, ProgramItemController, UpdateProgramItemUsecase } from './useCases/programItem';
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
			ProductEntity,
			ProgramItemEntity,
			InvoiceEntity,
			AttendeeEntity,
		]),
		EventEmitterModule.forRoot()
	],
	controllers: [
		UserController,
		ProgramController,
		ProductController,
		ProgramItemController,
		AttendeeController,
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
		CreateProgramItemUsecase,
		GetProgramItemUsecase,
		DeleteProgramItemUsecase,
		DeleteProgramItemByProgramIdUsecase,
		UpdateProgramItemUsecase,
		CreateAttendeeUsecase,
		GetAttendeeUsecase,
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
		{
			provide: 'ProgramItemRepository',
			useClass: ProgramItemRepository,
		},
		{
			provide: 'InvoiceRepository',
			useClass: InvoiceRepository,
		},
		{
			provide: 'AttendeeRepository',
			useClass: AttendeeRepository,
		}
	],
})
export class TicketModule {}
