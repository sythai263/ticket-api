import {
	BadRequestException,
	Controller, Get, HttpCode,
	HttpStatus, InternalServerErrorException, NotFoundException, Param, Req, UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth, ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger';
import { Request } from 'express';

import { InvoiceDto } from '../../infrastructures/dtos/invoice';
import { GetInvoiceUsecase } from './get/getInvoice.usecase';
import { InvoiceErrors } from './invoice.error';

@Controller('api/invoice')
@ApiTags('Invoice')
export class InvoiceController {
	constructor(
		public readonly getInvoice: GetInvoiceUsecase,

	) { }

	@Get(':id')
	@ApiParam({
		name: 'id',
		description:'Mã hóa đơn'
	})
	@ApiOperation({
		description: 'Lấy thông tin về 1 hóa đơn',
		summary:'Lấy thông tin về 1 hóa đơn'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: InvoiceDto
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(
		@Req() req: Request,
		@Param('id') id: number
	): Promise<InvoiceDto> {
		const result = await this.getInvoice.execute(id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case InvoiceErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			case InvoiceErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

}
