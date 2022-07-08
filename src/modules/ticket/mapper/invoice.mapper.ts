import { SYSTEM } from '../../../common/constants/system';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { InvoiceDomain } from '../../../domain';
import { InvoiceEntity } from '../../../entities';
import { CreateInvoiceDto, InvoiceDto } from '../infrastructures/dtos/invoice';

export class InvoiceMap{

	static entityToDto(entity: InvoiceEntity): InvoiceDto {

		const dto = new InvoiceDto();
		dto.id = entity.id;
		dto.amount = entity.amount;
		dto.bankCode = entity.bankCode;
		dto.bankTransNo = entity.bankTransNo;
		dto.cardType = entity.cardType;
		dto.currencyCode = entity.currencyCode;
		dto.info = entity.info;
		dto.payDate = entity.payDate;

		return dto;
	}

	static dtoToEntity(dto: InvoiceDto): InvoiceEntity {
		const entity = new InvoiceEntity();
		entity.amount = dto.amount;
		entity.bankCode = dto.bankCode;
		entity.bankTransNo = dto.bankTransNo;
		entity.cardType = dto.cardType;
		entity.currencyCode = dto.currencyCode;
		entity.info = dto.info;
		entity.payDate = dto.payDate;

		return entity;
	}

	static createDtoToEntity(dto: CreateInvoiceDto): InvoiceEntity {
		const entity = new InvoiceEntity();
		entity.amount = dto.amount;
		entity.bankCode = dto.bankCode;
		entity.bankTransNo = dto.bankTransNo;
		entity.cardType = dto.cardType;
		entity.currencyCode = dto.currencyCode;
		entity.info = dto.info;
		entity.payDate = dto.payDate;
		return entity;
	}

	static entityToDomain(entity: InvoiceEntity): InvoiceDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const invoiceOrError = InvoiceDomain.create(
			{
				amount: entity.amount,
				bankCode: entity.bankCode,
				bankTransNo: entity.bankTransNo,
				cardType: entity.cardType,
				currencyCode: entity.currencyCode,
				info: entity.info,
				payDate: entity.payDate,
				status: entity.status
			},
			new UniqueEntityID(id),
		);
		return invoiceOrError.isSuccess ? invoiceOrError.getValue() : null;
	}

	static toEntity(domain: InvoiceDomain): InvoiceEntity {
		const entity = new InvoiceEntity();
		entity.id = domain.id.toValue();
		entity.amount = domain.amount;
		entity.bankCode = domain.bankCode;
		entity.bankTransNo = domain.bankTransNo;
		entity.cardType = domain.cardType;
		entity.currencyCode = domain.currencyCode;
		entity.info = domain.info;
		entity.payDate = domain.payDate;
		entity.status = domain.status;
		return entity;
	}

	static toCreateEntity(domain: InvoiceDomain): InvoiceEntity {
		const entity = new InvoiceEntity();
		entity.amount = domain.amount;
		entity.bankCode = domain.bankCode;
		entity.bankTransNo = domain.bankTransNo;
		entity.cardType = domain.cardType;
		entity.currencyCode = domain.currencyCode;
		entity.info = domain.info;
		entity.payDate = domain.payDate;
		entity.status = domain.status;
		entity.createdBy = SYSTEM;
		entity.updatedBy = SYSTEM;
		return entity;
	}

	static toDto(domain: InvoiceDomain): InvoiceDto {
		const dto = new InvoiceDto();
		dto.id = domain.id.toValue();
		dto.amount = domain.amount;
		dto.bankCode = domain.bankCode;
		dto.bankTransNo = domain.bankTransNo;
		dto.cardType = domain.cardType;
		dto.currencyCode = domain.currencyCode;
		dto.info = domain.info;
		dto.payDate = domain.payDate;
		dto.isPaid = domain.isPaid();

		return dto;
	}

	static toDtos(domains: InvoiceDomain[]): InvoiceDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: InvoiceEntity[]): InvoiceDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static dtoToDomain(dto: CreateInvoiceDto): InvoiceDomain{
		if (!dto) {
			return null;
		}

		const invoiceOrError = InvoiceDomain.create(
			{
				amount: dto.amount,
				bankCode: dto.bankCode,
				bankTransNo: dto.bankTransNo,
				cardType: dto.cardType,
				currencyCode: dto.currencyCode,
				info: dto.info,
				payDate: dto.payDate
			}
		);
		return invoiceOrError.isSuccess ? invoiceOrError.getValue() : null;
	}

}
