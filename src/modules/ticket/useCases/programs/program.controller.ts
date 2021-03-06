import {
	BadRequestException,
	Body,
	Controller, Delete, Get, HttpCode,
	HttpStatus,
	InternalServerErrorException, NotFoundException, Param, Patch, Post, Query, Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { SuccessNotification } from '../../../../core/infra/Success';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import FilesInterceptor from '../../../../interceptors/file.interceptor';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { PaginationProgramDto } from '../../infrastructures/dtos/program';
import {
	CreateProgramDto,
	ProgramDto,
	SearchProgramDto,
	UpdateProgramDto
} from '../../infrastructures/dtos/program/';
import { CreateProgramUsecase } from './create/createProgram.usecase';
import { DeleteProgramUsecase } from './delete/deleteProgram.usecase';
import { GetProgramByIdUsecase } from './get/getProgramById.usecase';
import { GetProgramsUsecase } from './get/getPrograms.usecase';
import { ProgramErrors } from './program.error';
import { ChangeAvatarProgramUseCase } from './update/changeAvatar.usecase';
import { ChangeCheckInProgramUsecase } from './update/changeCheckInProgram.usecase';
import { UpdateProgramUsecase } from './update/updateProgram.usecase';

@Controller('api/programs')
@ApiTags('Program')
export class ProgramController {
	constructor(
		public readonly createProgram: CreateProgramUsecase,
		public readonly getProgram: GetProgramsUsecase,
		public readonly getProgramById: GetProgramByIdUsecase,
		public readonly updateProgram: UpdateProgramUsecase,
		public readonly changeStatus: ChangeCheckInProgramUsecase,
		public readonly deleteProgram: DeleteProgramUsecase,
		public readonly changeAvatar: ChangeAvatarProgramUseCase,
	) { }

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Tạo một chương trình/ sự kiện mới',
		summary:'Tạo một chương trình/ sự kiện mới'
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: ProgramDto
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
	async execute(@Req() req: Request, @Body() dto: CreateProgramDto): Promise<ProgramDto> {
		const user = req.user as JwtPayload;
		const result = await this.createProgram.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		description: 'Lấy danh sách các chương trình, sự kiện',
		summary:'Lấy danh sách các chương trình, sự kiện'
	})
	@ApiResponse({
		type: PaginationProgramDto
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
		@Query() dto: SearchProgramDto): Promise<PaginationProgramDto> {
		const result = await this.getProgram.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.Error:
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
		description:'Mã của chương trình, sự kiện'
	})
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		description: 'Lấy thông tin về 1 sự kiện',
		summary:'Lấy thông tin về 1 sự kiện'
	})
	@ApiResponse({
		type: ProgramDto
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
	@Param('id') id: number): Promise<ProgramDto> {
		const result = await this.getProgramById.execute(id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.Error:
				throw new BadRequestException(err.errorValue());
			case ProgramErrors.NotFound:
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
		description:'Mã của chương trình, sự kiện'
	})
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Cập nhật thông tin của 1 chương trình, sự kiện',
		summary:'Cập nhật thông tin của 1 chương trình, sự kiện'
	})
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: ProgramDto
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
		@Body() dto: UpdateProgramDto
	): Promise<ProgramDto> {
		dto.id = id;
		const user = req.user as JwtPayload;
		const result = await this.updateProgram.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.Error:
				throw new BadRequestException(err.errorValue());
			case ProgramErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();

	}

	@Patch(':id/status')
	@ApiParam({
		name: 'id',
		description:'Mã của chương trình, sự kiện'
	})
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Thay đổi trạng thái check-in của sự kiện',
		summary:'Thay đổi trạng thái check-in của sự kiện'
	})
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: ProgramDto
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
	async changeStatusCheckIn(
		@Req() req: Request,
		@Param('id') id: number,
	): Promise<ProgramDto> {
		const user = req.user as JwtPayload;
		const result = await this.changeStatus.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.Error:
				throw new BadRequestException(err.errorValue());
			case ProgramErrors.NotFound:
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
		description:'Mã của chương trình, sự kiện'
	})
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Xóa chương trình, sự kiện',
		summary:'Xóa chương trình, sự kiện'
	})
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
		const result = await this.deleteProgram.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.Error:
				throw new BadRequestException(err.errorValue());
			case ProgramErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Delete program successfully !', HttpStatus.CREATED);
	}

	@Post(':id/avatar')
  @ApiBearerAuth()
  @ApiOperation({
  	description: 'Thay đổi avatar',
  	summary: 'Thay đổi avatar',
  })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				avatar: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiParam({
		name: 'id',
		description:'id sản phẩm cần đổi avatar'
	})
  @UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
  @UseInterceptors(
  	FilesInterceptor({
  		fieldName: 'avatar',
  		path:'./'
  	}),
  )
	@ApiResponse({
		type: ProgramDto
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
	async uploadAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
	): Promise<ProgramDto> {
		const user = req.user as JwtPayload;
  	const result = await this.changeAvatar.execute(file, user.id);
  	if (result.isLeft()) {
  		const err = result.value;
  		switch (err.constructor) {
			case ProgramErrors.NotFound:
				throw new NotFoundException(err.errorValue());
  		default:
  			throw new InternalServerErrorException(err.errorValue());
  		}
		}

		return result.value.getValue();
	}
}
