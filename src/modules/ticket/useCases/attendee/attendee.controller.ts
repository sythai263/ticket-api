import {
	BadRequestException,
	Body,
	Controller, ForbiddenException, Get, HttpCode,
	HttpStatus,
	InternalServerErrorException, NotFoundException, Param, Post, Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Request } from 'express';

import { RoleType } from '../../../../common/constants/roleType';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { AttendeeDto, CreateAttendeeDto } from '../../infrastructures/dtos/attendee';
import { ProgramErrors } from '../programs';
import { AttendeeErrors } from './attendee.error';
import { CreateAttendeeUsecase } from './create/createAttendee.usecase';
import { GetAttendeeUsecase } from './get/getAttendee.usecase';
@Controller('api/attends')
@ApiTags('Attendee')
export class AttendeeController {
	constructor(
		public readonly createAttendee: CreateAttendeeUsecase,
		public readonly getAttendee: GetAttendeeUsecase,
		// // Public readonly getProductById: GetProductByIdUsecase,
		// public readonly updateItem: UpdateProgramItemUsecase,
		// public readonly deleteByProgramId: DeleteProgramItemByProgramIdUsecase,
		// public readonly deleteItem: DeleteProgramItemUsecase,

	) { }

	@Post()
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: AttendeeDto
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

	@ApiNotFoundResponse({
		description: 'Not found'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(
		@Req() req: Request,
		@Body() dto: CreateAttendeeDto): Promise<AttendeeDto> {
		const user = req.user as JwtPayload;
		dto.userId = user.id;
		dto.username = user.username;
		const result = await this.createAttendee.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case ProgramErrors.NotFound:
			case AttendeeErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			case AttendeeErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get(':id')
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: AttendeeDto
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

	@ApiNotFoundResponse({
		description: 'Not found'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getData(
		@Req() req: Request,
		@Param('id') id: number): Promise<AttendeeDto> {
		const user = req.user as JwtPayload;
		const result = await this.getAttendee.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
			case AttendeeErrors.NotFound:
				throw new NotFoundException(err.errorValue());
			case AttendeeErrors.Forbidden:
				throw new ForbiddenException(err.errorValue());
			case AttendeeErrors.Error:
				throw new BadRequestException(err.errorValue());
			default:
				throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

}
