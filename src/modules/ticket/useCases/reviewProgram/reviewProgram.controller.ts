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
	ValidationPipe,
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
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

import { RoleType } from '../../../../common/constants/roleType';
import { PageOptionsDto } from '../../../../common/dto/PageOptionsDto';
import { SuccessNotification } from '../../../../core/infra/Success';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { ConfigService } from '../../../../shared/services/config.service';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import {
	CreateReviewProgramDto,
	PaginationReviewProgramDto,
	ReviewProgramDto,
	UpdateReviewProgramDto,
} from '../../infrastructures/dtos/reviewProgram';
import { ProgramErrors } from '../programs';
import { CreateReviewsProgramsUsecase } from './create/createReviewProgram.usecase';
import { DeleteReviewProgramUsecase } from './delete/deleteReviewProgram.usecase';
import { GetReviewsProgramsUsecase } from './get/getReviewPrograms.usecase';
import { ReviewProgramErrors } from './reviewProgram.error';
import { UpdateReviewsProgramsUsecase } from './update/updateReviewProgram.usecase';

@Controller('api/reviews')
@ApiTags('Review')
export class ReviewProgramController {
	constructor(
		public readonly getReview: GetReviewsProgramsUsecase,
		public readonly create: CreateReviewsProgramsUsecase,
		public readonly update: UpdateReviewsProgramsUsecase,
		public readonly del: DeleteReviewProgramUsecase,
		public config: ConfigService,
	) {}

	@Get('program/:id')
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		description: 'Lấy danh sách các đánh giá',
		summary: 'Lấy danh sách các đánh giá',
	})
	@ApiParam({
		name: 'id',
		description: 'Mã chương trình',
	})
	@ApiResponse({
		type: PaginationReviewProgramDto,
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(
		@Req() req: Request,
		@Query() dto: PageOptionsDto,
		@Param('id') id: number,
	): Promise<PaginationReviewProgramDto> {
		let userId = -1;
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
		if (token !== 'null') {
			const secret = this.config.get('JWT_SECRET');
			const user = verify(token, secret) as JwtPayload;
			if (user) {
				userId = user.id;
			}
		}

		const result = await this.getReview.execute(dto, id, userId);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ReviewProgramErrors.Error:
					throw new BadRequestException(err.errorValue());
				case ReviewProgramErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Post('program')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Tạo một đánh giá mới',
		summary: 'Tạo một đánh giá mới',
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: ReviewProgramDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async createReview(@Req() req: Request, @Body() dto: CreateReviewProgramDto): Promise<ReviewProgramDto> {
		const user = req.user as JwtPayload;
		dto.userId = user.id;
		const result = await this.create.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProgramErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				case ReviewProgramErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				case ReviewProgramErrors.Error:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Patch('program')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Chỉnh sửa một đánh giá',
		summary: 'Chỉnh sửa một đánh giá',
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: ReviewProgramDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async updateReview(@Req() req: Request, @Body() dto: UpdateReviewProgramDto): Promise<ReviewProgramDto> {
		const user = req.user as JwtPayload;
		dto.userId = user.id;
		const result = await this.update.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProgramErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				case ReviewProgramErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				case ReviewProgramErrors.Error:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Delete('program/:id')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Xóa một đánh giá',
		summary: 'Xóa một đánh giá',
	})
	@ApiParam({
		name: 'id',
		description: 'Mã đánh giá ',
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: ReviewProgramDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
	})
	@ApiForbiddenResponse({
		description: 'Forbidden',
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async deleteReview(@Req() req: Request, @Param('id') id: number): Promise<SuccessNotification> {
		const user = req.user as JwtPayload;
		const result = await this.del.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case ProgramErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				case ReviewProgramErrors.NotFound:
					throw new NotFoundException(err.errorValue());
				case ReviewProgramErrors.Error:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Đã xóa đánh giá thành công!', HttpStatus.CREATED);
	}
}
