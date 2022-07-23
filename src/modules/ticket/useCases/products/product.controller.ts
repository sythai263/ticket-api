import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { SuccessNotification } from '../../../../core/infra/Success';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import {
	CreateProductDto,
	PaginationProductDto,
	ProductDto,
	SearchProductDto,
	UpdateProductDto
} from '../../infrastructures/dtos/product';
import { CreateProductUsecase } from './create/createProduct.usecase';
import { DeleteProductUsecase } from './delete/deleteProduct.usecase';
import { GetProductByIdUsecase } from './get/getProductById.usecase';
import { GetProductsUsecase } from './get/getProducts.usecase';
import { ProductErrors } from './product.error';
import { UpdateProductUsecase } from './update/updateProduct.usecase';

@Controller('api/products')
@ApiTags('Product')
export class ProductController {
	constructor(
		public readonly createProduct: CreateProductUsecase,
		public readonly getProducts: GetProductsUsecase,
		public readonly getProductById: GetProductByIdUsecase,
		public readonly updateProduct: UpdateProductUsecase,
		public readonly deleteProduct: DeleteProductUsecase,

	) { }

	@Post()
	@ApiOperation({
		description: 'Thêm một sản phẩm mới',
		summary:'Thêm một sản phẩm mới'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: ProductDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(@Req() req: Request, @Body() dto: CreateProductDto): Promise<ProductDto> {
		const user = req.user as JwtPayload;
		const result = await this.createProduct.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProductErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get()
	@ApiOperation({
		description: 'Lấy danh sách các sản phẩm ',
		summary:'Lấy danh sách các sản phẩm '
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: PaginationProductDto,
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async search(
		@Req() req: Request,
		@Query() dto: SearchProductDto): Promise<PaginationProductDto> {

		const result = await this.getProducts.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProductErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get(':id')
	@ApiParam({
		name: 'id',
		description:'Mã của sản phẩm'
	})
	@ApiOperation({
		description: 'Lấy thồng tin về 1 sản phẩm',
		summary:'Lấy thồng tin về 1 sản phẩm'
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: ProductDto
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getById(
		@Req() req: Request,
		@Param('id') id: number): Promise<ProductDto> {

		const result = await this.getProductById.execute(id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProductErrors.Error:
				throw new BadRequestException(err.errorValue());
			case ProductErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();

	}

	@Patch(':id')
	@ApiParam({
		name: 'id',
		description:'Mã của sản phẩm'
	})
	@ApiOperation({
		description: 'Cập nhật thông tin 1 sản phẩm',
		summary:'Cập nhật thông tin 1 sản phẩm'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: ProductDto
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async updateById(
		@Req() req: Request,
		@Param('id') id: number,
		@Body() dto: UpdateProductDto
	): Promise<ProductDto> {
		dto.id = id;
		const user = req.user as JwtPayload;
		const result = await this.updateProduct.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProductErrors.Error:
				throw new BadRequestException(err.errorValue());
			case ProductErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();

	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		description:'Mã của sản phẩm'
	})
	@ApiOperation({
		description: 'Xóa thông tin của 1 sản phẩm',
		summary:'Xóa thông tin của 1 sản phẩm'
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@Roles(RoleType.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiResponse({
		type: SuccessNotification
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async delete(
		@Req() req: Request,
		@Param('id') id: number,
	): Promise<SuccessNotification> {
		const user = req.user as JwtPayload;
		const result = await this.deleteProduct.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProductErrors.Error:
				throw new BadRequestException(err.errorValue());
			case ProductErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Đã xóa sản phẩm', HttpStatus.CREATED);
	}
}
