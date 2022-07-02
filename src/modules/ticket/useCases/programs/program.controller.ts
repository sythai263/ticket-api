import {
	BadRequestException,
	Body,
	Controller, Delete, Get, HttpCode,
	HttpStatus,
	InternalServerErrorException, Param, Patch, Post, Query, Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { SuccessNotification } from '../../../../core/infra/Success';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { PaginationProgramDto } from '../../infrastructures/dtos/program';
import { CreateProgramDto } from '../../infrastructures/dtos/program/createProgram.dto';
import { ProgramDto } from '../../infrastructures/dtos/program/program.dto';
import { SearchProgramDto } from '../../infrastructures/dtos/program/searchProgram.dto';
import { UpdateProgramDto } from '../../infrastructures/dtos/program/updateProgram.dto';
import { CreateProgramUsecase } from './create/createProgram.usecase';
import { DeleteProgramUsecase } from './delete/deleteProgram.usecase';
import { GetProgramByIdUsecase } from './get/getProgramById.usecase';
import { GetProgramsUsecase } from './get/getPrograms.usecase';
import { ProgramErrors } from './program.error';
import { UpdateProgramUsecase } from './update/updateProgram.usecase';

@Controller('api/programs')
@ApiTags('Program')
export class ProgramController {
	constructor(
		public readonly createProgram: CreateProgramUsecase,
		public readonly getProgram: GetProgramsUsecase,
		public readonly getProgramById: GetProgramByIdUsecase,
		public readonly updateProgram: UpdateProgramUsecase,
		public readonly deleteProgram: DeleteProgramUsecase,
	) { }

	@Post()
	@ApiBearerAuth()
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
	@HttpCode(HttpStatus.OK)
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
	async getById(@Req() req: Request, @Param('id') id: number): Promise<ProgramDto> {
		const result = await this.getProgramById.execute(id);
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

	@Patch(':id')
	@ApiBearerAuth()
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
			case ProgramErrors.NotFound:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();

	}

	@Delete(':id')
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
		const result = await this.deleteProgram.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.Error:
			case ProgramErrors.NotFound:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Delete program successfully !', HttpStatus.CREATED);
	}
}