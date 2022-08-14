import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
	AttendeeEntity,
	DetailOrderEntity,
	DiscountEntity,
	ImageEntity,
	InvoiceEntity,
	ProductEntity,
	ProgramEntity,
	ProgramItemEntity,
	PurchaseEntity,
	ReviewProductEntity,
	ReviewProgramEntity,
	UserEntity,
} from '../../entities';
import { EventListener } from './events/event.listener';
import {
	AttendeeRepository,
	DetailOrderRepository,
	DiscountRepository,
	ImageRepository,
	InvoiceRepository,
	ProductRepository,
	ProgramItemRepository,
	ProgramRepository,
	PurchaseRepository,
	ReviewProductRepository,
	ReviewProgramRepository,
	UserRepository,
} from './repositories';
import {
	AdminCheckInAttendeeUsecase,
	AttendeeController,
	CreateAttendeeUsecase,
	DeleteAttendeeUsecase,
	GetAttendeeByProgramUsecase,
	GetAttendeeByUserUsecase,
	GetAttendeeUsecase,
} from './useCases/attendee';
import {
	CreateDiscountUsecase,
	DeleteDiscountUsecase,
	DiscountController,
	GetDiscountByIdUsecase,
	GetDiscountUsecase,
	UpdateDiscountUsecase,
} from './useCases/discount';
import { GetInvoiceUsecase, InvoiceController } from './useCases/invoice';
import {
	IpnVNPayUsecase,
	PaymentAttendanceUsecase,
	PaymentController,
	PaymentOrderUsecase,
	PaymentReturnAttendanceUsecase,
	PaymentReturnOrderUsecase,
} from './useCases/payment';
import {
	ChangeAvatarProductUseCase,
	CreateProductUsecase,
	DeleteProductUsecase,
	GetProductByIdUsecase,
	GetProductsUsecase,
	ProductController,
	UpdateProductUsecase,
} from './useCases/products';
import {
	CreateProgramItemUsecase,
	DeleteProgramItemByProgramIdUsecase,
	DeleteProgramItemUsecase,
	GetProgramItemUsecase,
	ProgramItemController,
	UpdateProgramItemUsecase,
} from './useCases/programItem';
import {
	ChangeAvatarProgramUseCase,
	ChangeCheckInProgramUsecase,
	CreateProgramUsecase,
	DeleteProgramUsecase,
	GetProgramByIdUsecase,
	GetProgramsUsecase,
	ProgramController,
	UpdateProgramUsecase,
} from './useCases/programs';
import {
	ChangeStatusOrderUsecase,
	CreateOrderUsecase,
	PurchaseController,
	UserReceivedOrderUsecase,
} from './useCases/purchase';
import { UploadController } from './useCases/upload/upload.controller';
import {
	ChangeAvatarUserUseCase,
	ChangePasswordUseCase,
	CreateUserUsecase,
	DeleteUserUsecase,
	ForgotPasswordUseCase,
	GetUserUseCase,
	UpdateUserUseCase,
	UserController,
} from './useCases/users';

@Module({
	imports: [
		HttpModule,
		TypeOrmModule.forFeature([
			UserEntity,
			ProgramEntity,
			ProductEntity,
			InvoiceEntity,
			ImageEntity,
			AttendeeEntity,
			PurchaseEntity,
			ProgramItemEntity,
			DiscountEntity,
			PurchaseEntity,
			DetailOrderEntity,
			ReviewProductEntity,
			ReviewProgramEntity,
		]),
		EventEmitterModule.forRoot(),
		ScheduleModule.forRoot(),
	],
	controllers: [
		UploadController,
		UserController,
		ProgramController,
		ProductController,
		ProgramItemController,
		AttendeeController,
		InvoiceController,
		PaymentController,
		PurchaseController,
		DiscountController,
	],
	providers: [
		EventListener,
		GetUserUseCase,
		UpdateUserUseCase,
		ChangePasswordUseCase,
		ChangeAvatarUserUseCase,
		CreateUserUsecase,
		DeleteUserUsecase,
		ForgotPasswordUseCase,
		CreateProgramUsecase,
		GetProgramsUsecase,
		GetProgramByIdUsecase,
		UpdateProgramUsecase,
		ChangeAvatarProductUseCase,
		ChangeAvatarProgramUseCase,
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
		GetAttendeeByProgramUsecase,
		GetAttendeeByUserUsecase,
		DeleteAttendeeUsecase,
		AdminCheckInAttendeeUsecase,
		GetInvoiceUsecase,
		PaymentAttendanceUsecase,
		PaymentOrderUsecase,
		PaymentReturnAttendanceUsecase,
		PaymentReturnOrderUsecase,
		CreateOrderUsecase,
		CreateDiscountUsecase,
		GetDiscountUsecase,
		IpnVNPayUsecase,
		GetDiscountByIdUsecase,
		UpdateDiscountUsecase,
		DeleteDiscountUsecase,
		ChangeStatusOrderUsecase,
		UserReceivedOrderUsecase,
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
		},
		{
			provide: 'PurchaseRepository',
			useClass: PurchaseRepository,
		},
		{
			provide: 'DetailOrderRepository',
			useClass: DetailOrderRepository,
		},
		{
			provide: 'ReviewProductRepository',
			useClass: ReviewProductRepository,
		},
		{
			provide: 'ReviewProgramRepository',
			useClass: ReviewProgramRepository,
		},
		{
			provide: 'DiscountRepository',
			useClass: DiscountRepository,
		},
		{
			provide: 'ImageRepository',
			useClass: ImageRepository,
		},
	],
})
export class TicketModule {}
