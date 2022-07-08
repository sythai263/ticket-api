import { Inject, Injectable } from '@nestjs/common';

import { IUseCase } from '../../../../../core/domain/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Either, left, Result, right } from '../../../../../core/logic/Result';
import { InvoiceDto } from '../../../infrastructures/dtos/invoice';
import { InvoiceMap } from '../../../mapper';
import { InvoiceRepository } from '../../../repositories';
import { InvoiceErrors } from '../invoice.error';

type Response = Either<
  AppError.UnexpectedError | InvoiceErrors.NotFound | InvoiceErrors.Error,
  Result<InvoiceDto>
>;

@Injectable()
export class GetInvoiceUsecase implements IUseCase<number, Promise<Response>> {
	constructor(
		@Inject('InvoiceRepository') public readonly repo: InvoiceRepository
	) { }

	async execute(id: number): Promise<Response> {

		const domain = await this.repo.findById(id);

		if (!domain) {
			return left(new InvoiceErrors.NotFound());
		}

		return right(Result.ok(InvoiceMap.toDto(domain)));

	}

}
