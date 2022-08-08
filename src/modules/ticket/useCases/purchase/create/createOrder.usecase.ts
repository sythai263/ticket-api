import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { In } from 'typeorm';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { PurchaseDomain } from '../../../../../domain';
import { CreatePurchaseDto, PurchaseDto } from '../../../infrastructures/dtos/purchase';
import { DetailOrderMap, InvoiceMap, PurchaseMap } from '../../../mapper';
import {
	DetailOrderRepository,
	DiscountRepository,
	InvoiceRepository,
	ProductRepository,
	ProgramItemRepository,
	PurchaseRepository,
	UserRepository,
} from '../../../repositories';
import { DiscountErrors } from '../../discount/discount.error';
import { PurchaseErrors } from '../purchase.error';

type Response = Either<
	| AppError.UnexpectedError
	| DiscountErrors.NotFound
	| DiscountErrors.Error
	| PurchaseErrors.Error
	| PurchaseErrors.NotFoundProducts,
	Result<PurchaseDto>
>;

@Injectable()
export class CreateOrderUsecase implements IUseCase<CreatePurchaseDto, Promise<Response>> {
	constructor(
		@Inject('PurchaseRepository') public readonly repo: PurchaseRepository,
		@Inject('ProductRepository') public readonly productRepo: ProductRepository,
		@Inject('DiscountRepository') public readonly discountRepo: DiscountRepository,
		@Inject('ProgramItemRepository') public readonly itemRepo: ProgramItemRepository,
		@Inject('InvoiceRepository') public readonly invoiceRepo: InvoiceRepository,
		@Inject('DetailOrderRepository') public readonly detailRepo: DetailOrderRepository,
		@Inject('UserRepository') public readonly userRepo: UserRepository,
		private event: EventEmitter2,
	) {}

	async execute(dto: CreatePurchaseDto, userId: number): Promise<Response> {
		const ids = dto.details.map((detail) => detail.productId);
		const products = await this.productRepo.find({
			where: {
				id: In(ids),
			},
		});
		const user = await this.userRepo.findById(userId);

		const idsSearch = products.map((product) => product.id.toValue());

		const diff = ids.filter((id) => !idsSearch.includes(id));
		if (diff.length > 0) {
			return left(new PurchaseErrors.NotFoundProducts(diff));
		}

		for (const product of products) {
			const quantity = dto.details.find((detail) => detail.productId === product.id.toValue());
			product.buyAmount = quantity.amount;
		}

		const discount = await this.discountRepo.getProducts(dto.discountCode);
		if (dto.discountCode !== '' && !discount) {
			return left(new DiscountErrors.NotFound(dto.discountCode));
		}

		if (discount && !discount.canUse()) {
			return left(new DiscountErrors.Error('Không thể sử dụng mã giảm giá này !'));
		}

		const purchase = new PurchaseDomain({
			details: null,
			invoice: null,
			orderDate: null,
			user,
		});
		purchase.createDetails(products, discount);
		purchase.createInvoice();

		const invoiceEntity = InvoiceMap.toEntity(purchase.invoice);
		invoiceEntity.createdBy = userId;
		invoiceEntity.updatedBy = userId;
		const invoice = await this.invoiceRepo.save(invoiceEntity);
		purchase.invoice = invoice;

		const purchaseEntity = PurchaseMap.toEntity(purchase);
		purchaseEntity.createdBy = userId;
		purchaseEntity.updatedBy = userId;
		const purchaseSave = await this.repo.save(purchaseEntity);

		for (const detail of purchase.details) {
			detail.purchase = purchaseSave;
		}

		const detailEntities = DetailOrderMap.toEntities(purchase.details);
		for (const detail of detailEntities) {
			detail.createdBy = userId;
			detail.updatedBy = userId;
		}

		const details = await this.detailRepo.saveMany(detailEntities);
		purchaseSave.details = details;

		invoice.info = `Thanh toan don mua hang ${purchaseSave.id.toValue()} tri gia ${invoice.amount.toLocaleString(
			'vi-VN',
		)} VND`;
		await this.invoiceRepo.save(InvoiceMap.toEntity(invoice));

		const buy = await this.repo.getDetails(purchaseSave.id.toValue());
		const purchaseDto = PurchaseMap.toDto(buy);
		this.event.emit('purchase.order', purchaseDto);

		return right(Result.ok(PurchaseMap.toDto(purchaseSave)));
	}
}
