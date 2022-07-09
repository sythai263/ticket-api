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
import { AdminCheckInAttendeeUsecase, AttendeeController, CreateAttendeeUsecase, DeleteAttendeeUsecase, GetAttendeeUsecase } from './useCases/attendee';
import { GetInvoiceUsecase, InvoiceController } from './useCases/invoice';
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
	ChangeCheckInProgramUsecase,
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
		InvoiceController,
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
		ChangeCheckInProgramUsecase,
		CreateAttendeeUsecase,
		GetAttendeeUsecase,
		DeleteAttendeeUsecase,
		AdminCheckInAttendeeUsecase,
		GetInvoiceUsecase,
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
