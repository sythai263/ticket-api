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
	Patch,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { SuccessNotification } from '../../../../core/infra/Success';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { UserDto } from '../../../user/user.dto';
import {
	CreateUserDto,
	ForgotPasswordDto,
	PasswordDto,
	UpdateUserDto
} from '../../infrastructures/dtos/user';
import {
	ChangePasswordUseCase,
	CreateUserUsecase,
	DeleteUserUsecase,
	ForgotPasswordUseCase,
	GetUserUseCase,
	UpdateUserUseCase
} from './';
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
	) { }

  @Get()
	@ApiBearerAuth()
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

  	return new SuccessNotification('Delete successfully !', HttpStatus.CREATED);
  }

	@Post()
	@HttpCode(HttpStatus.CREATED)
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
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({ type: UserDto })
	@ApiBearerAuth()
  @UsePipes(new ValidationPipe({ transform: true }))
	async patchUser(@Req() req: Request, @Body() dto: UpdateUserDto): Promise<UserDto> {
  	const user = req.user as JwtPayload;
  	const result = await this.updateUser.execute(dto,user.id);
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
	@ApiResponse({ type: UserDto })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
	async changePassword(@Req() req: Request, @Body() dto: PasswordDto): Promise<UserDto> {
  	const user = req.user as JwtPayload;
  	const result = await this.password.execute(dto,user.id);
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

		return new SuccessNotification('Password has been reset, please check email!', HttpStatus.CREATED);
	}
}
