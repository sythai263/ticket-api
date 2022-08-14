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
	Patch,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { SuccessNotification } from '../../../../core/infra/Success';
import FilesInterceptor from '../../../../interceptors/file.interceptor';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { AttendeeDto } from '../../infrastructures/dtos/attendee';
import { CreateUserDto, ForgotPasswordDto, PasswordDto, UpdateUserDto, UserDto } from '../../infrastructures/dtos/user';
import { AttendeeErrors, GetAttendeeByUserUsecase } from '../attendee';
import {
	ChangePasswordUseCase,
	CreateUserUsecase,
	DeleteUserUsecase,
	ForgotPasswordUseCase,
	GetUserUseCase,
	UpdateUserUseCase,
} from './';
import { ChangeAvatarUserUseCase } from './update/changeAvatar.usecase';
import { GetUserErrors } from './user.error';

@Controller('api/user')
@ApiTags('User')
export class UserController {
	constructor(
		public readonly userInfo: GetUserUseCase,
		public readonly updateUser: UpdateUserUseCase,
		public readonly password: ChangePasswordUseCase,
		public readonly create: CreateUserUsecase,
		public readonly deleteUser: DeleteUserUsecase,
		public readonly forgotPassword: ForgotPasswordUseCase,
		public readonly changeAvatar: ChangeAvatarUserUseCase,
		public readonly getByUser: GetAttendeeByUserUsecase,
	) {}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Lấy thông tin của user đang đăng nhập',
		summary: 'Lấy thông tin của user đang đăng nhập',
	})
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@ApiResponse({ type: UserDto })
	@UsePipes(new ValidationPipe({ transform: true }))
	async execute(@Req() req: Request): Promise<UserDto> {
		const user = req.user as JwtPayload;
		const result = await this.userInfo.execute(user.username);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case GetUserErrors.UserNotFound:
					throw new NotFoundException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Delete()
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Xóa tài khoản (soft delete)',
		summary: 'Xóa tài khoản',
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard)
	@ApiResponse({ type: SuccessNotification })
	@UsePipes(new ValidationPipe({ transform: true }))
	async delete(@Req() req: Request): Promise<SuccessNotification> {
		const user = req.user as JwtPayload;
		const result = await this.deleteUser.execute(user.username, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case GetUserErrors.ErrorUser:
					throw new NotFoundException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Đã xóa tài khoản!', HttpStatus.CREATED);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		description: 'Đăng ký tài khoản',
		summary: 'Đăng ký tài khoản',
	})
	@ApiResponse({ type: UserDto })
	@UsePipes(new ValidationPipe({ transform: true }))
	async createUser(@Req() req: Request, @Body() userDto: CreateUserDto): Promise<UserDto> {
		const result = await this.create.execute(userDto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case GetUserErrors.ErrorUser:
				case GetUserErrors.ErrorPassword:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Patch()
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		description: 'Cập nhật thông tin của user đang đăng nhập',
		summary: 'Cập nhật thông tin của user đang đăng nhập',
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ type: UserDto })
	@ApiBearerAuth()
	@UsePipes(new ValidationPipe({ transform: true }))
	async patchUser(@Req() req: Request, @Body() dto: UpdateUserDto): Promise<UserDto> {
		const user = req.user as JwtPayload;
		const result = await this.updateUser.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case GetUserErrors.UserNotFound:
					throw new NotFoundException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Patch('password')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		description: 'Thay đổi mật khẩu',
		summary: 'Thay đổi mật khẩu',
	})
	@ApiResponse({ type: UserDto })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	async changePassword(@Req() req: Request, @Body() dto: PasswordDto): Promise<UserDto> {
		const user = req.user as JwtPayload;
		const result = await this.password.execute(dto, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case GetUserErrors.ErrorPassword:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Post('password')
	@ApiOperation({
		description: 'Khôi phục mật khẩu',
		summary: 'Khôi phục mật khẩu',
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ type: SuccessNotification })
	@UsePipes(new ValidationPipe({ transform: true }))
	async resetPassword(@Req() req: Request, @Body() dto: ForgotPasswordDto): Promise<SuccessNotification> {
		const result = await this.forgotPassword.execute(dto);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case GetUserErrors.UserNotFound:
					throw new BadRequestException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return new SuccessNotification('Mật khẩu đã được thay đổi, kiểm tra email !', HttpStatus.CREATED);
	}

	@Post('avatar')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Upload avatar',
		summary: 'Upload avatar',
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
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FilesInterceptor({
			fieldName: 'avatar',
			path: './',
		}),
	)
	@ApiResponse({
		type: UserDto,
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
	async uploadAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<UserDto> {
		const user = req.user as JwtPayload;
		const result = await this.changeAvatar.execute(file, user.id);
		if (result.isLeft()) {
			const err = result.value;
			switch (err.constructor) {
				case GetUserErrors.UserNotFound:
					throw new NotFoundException(err.errorValue());
				default:
					throw new InternalServerErrorException(err.errorValue());
			}
		}

		return result.value.getValue();
	}

	@Get('attendees')
	@ApiOperation({
		description: 'Lấy danh sách đăng ký của người đang đăng nhập',
		summary: 'Lấy danh sách đăng ký của người đang đăng nhập',
	})
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@ApiResponse({
		type: AttendeeDto,
		isArray: true,
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
	async getAttendeeByUser(@Req() req: Request): Promise<AttendeeDto[]> {
		const user = req.user as JwtPayload;
		const result = await this.getByUser.execute(user.id);
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
