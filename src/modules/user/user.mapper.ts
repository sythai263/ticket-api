import * as bcrypt from 'bcrypt';

import { ANOTHER_SYSTEM } from '../../common/constants/system';
import { UserEntity } from '../../entities/user.entity';
import { ConfigService } from '../../shared/services/config.service';
import { UserLoginDto } from './user.dto';

export class UserAuthMap {
	static entityToDto(entity: UserEntity): UserLoginDto {
		const userDto = new UserLoginDto();
		const config = new ConfigService();
		const url = config.get('DOMAIN');
		userDto.id = entity.id;
		if (entity.avatar.includes('https://')) {
			userDto.avatar = entity.avatar;
		} else {
			userDto.avatar = url + entity.avatar;
		}

		userDto.email = entity.email;
		userDto.username = entity.username;
		userDto.password = entity.password;
		userDto.firstName = entity.firstName;
		userDto.lastName = entity.lastName;
		userDto.role = entity.role;
		userDto.createdAt = entity.createdAt;
		userDto.updatedAt = entity.updatedAt;
		return userDto;
	}

	static async dtoToEntity(dto: UserLoginDto): Promise<UserEntity> {
		const entity = new UserEntity();
		entity.avatar = dto.avatar;
		entity.email = dto.email;
		entity.username = dto.username;
		entity.password = await this.hashPassword(dto.email, 12);
		entity.firstName = dto.firstName;
		entity.lastName = dto.lastName;
		entity.role = dto.role;
		entity.createdBy = ANOTHER_SYSTEM;
		entity.updatedBy = ANOTHER_SYSTEM;
		return entity;
	}

	static async hashPassword(password: string, genSalt: number): Promise<string> {
		const hashPwd = await bcrypt.hash(password, genSalt);
		return hashPwd;
	}
}
