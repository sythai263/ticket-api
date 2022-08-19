import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Patch,
	Post,
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
	ApiNotFoundResponse,
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
import { SuccessNotification } from '../../../../core/infra/Success';
import { Roles } from '../../../../decorators/Roles.decorator';
import { RolesGuard } from '../../../../guards/roles.guard';
import { ConfigService } from '../../../../shared/services/config.service';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { AttendeeDto, CheckAttendee, CreateAttendeeDto } from '../../infrastructures/dtos/attendee';
import { ProgramErrors } from '../programs';
import { AttendeeErrors } from './attendee.error';
import { CreateAttendeeUsecase } from './create/createAttendee.usecase';
import { DeleteAttendeeUsecase } from './delete/deleteAttendee.usecase';
import { GetAttendeeUsecase } from './get/getAttendee.usecase';
import { GetAttendeeByProgramUsecase } from './get/getProgram.usecase';
import { AdminCheckInAttendeeUsecase } from './update/adminCheckInAttendee.usecase';
@Controller('api/attendees')
@ApiTags('Attendee')
export class AttendeeController {
	constructor(
		public readonly createAttendee: CreateAttendeeUsecase,
		public readonly getAttendee: GetAttendeeUsecase,
		public readonly getProgram: GetAttendeeByProgramUsecase,
		public readonly deleteItem: DeleteAttendeeUsecase,
		public readonly checkIn: AdminCheckInAttendeeUsecase,
		public config: ConfigService,
	) {}

	@Post()
	@ApiOperation({
		description: 'Đăng ký tham dự hoặc check-in 1 chương trình, sự kiện',
		summary: 'Đăng ký tham dự hoặc check-in 1 chương trình, sự kiện',
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: AttendeeDto,
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
	@ApiNotFoundResponse({
		description: 'Not found',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(@Req() req: Request, @Body() dto: CreateAttendeeDto): Promise<AttendeeDto> {
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
		type: AttendeeDto,
	})
	@ApiParam({
		name: 'id',
		description: 'Mã đăng ký tham gia',
	})
	@ApiOperation({
		description: 'Lấy thông tin đăng ký của người dùng',
		summary: 'Lấy thông tin đăng ký của người dùng',
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
	@ApiNotFoundResponse({
		description: 'Not found',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getData(@Req() req: Request, @Param('id') id: number): Promise<AttendeeDto> {
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

	@Get('program/:id')
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: CheckAttendee,
	})
	@ApiParam({
		name: 'id',
		description: 'Mã chương trình',
	})
	@ApiOperation({
		description: 'Lấy thông tin đăng ký của người dùng đang đăng nhập',
		summary: 'Lấy thông tin đăng ký của người dùng đang đăng nhập',
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getByProgram(@Req() req: Request, @Param('id') id: number): Promise<CheckAttendee> {
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
		if (token === 'null') {
			return new CheckAttendee(false);
		}

		const secret = this.config.get('JWT_SECRET');
		const user = verify(token, secret) as JwtPayload;
		if (!user) {
			return new CheckAttendee(false);
		}

		const result = await this.getProgram.execute(id, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case AttendeeErrors.NotFound:
					return new CheckAttendee(false);
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new CheckAttendee(true);
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		description: 'Mã đăng ký tham gia',
	})
	@ApiOperation({
		description: 'Xóa đăng ký tham gia chương trình, sự kiện',
		summary: 'Xóa đăng ký tham gia chương trình, sự kiện',
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.USER)
	@ApiResponse({
		type: AttendeeDto,
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
	@ApiNotFoundResponse({
		description: 'Not found',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async delete(@Req() req: Request, @Param('id') id: number): Promise<SuccessNotification> {
		const user = req.user as JwtPayload;
		const result = await this.deleteItem.execute(id, user.id);
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

		return new SuccessNotification('Delete program successfully !', HttpStatus.CREATED);
	}

	@Patch(':id/check-in')
	@ApiParam({
		name: 'id',
		description: 'Mã đăng ký tham gia',
	})
	@ApiOperation({
		description: 'Admin check-in cho người tham gia',
		summary: 'Admin check-in cho người tham gia',
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
	@ApiResponse({
		type: AttendeeDto,
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
	@ApiNotFoundResponse({
		description: 'Not found',
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async checkInAttendee(@Req() req: Request, @Param('id') id: number): Promise<SuccessNotification> {
		const user = req.user as JwtPayload;
		const result = await this.checkIn.execute(id, user.id);
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

		return new SuccessNotification('Check-in thành công !', HttpStatus.CREATED);
	}
}
