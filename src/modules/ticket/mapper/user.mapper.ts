import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { UserDomain } from '../../../domain/user.domain';
import { UserEntity } from '../../../entities/user.entity';
import { ConfigService } from '../../../shared/services/config.service';
import { UserDto, UserShortDto } from '../infrastructures/dtos/user';
import { CreateUserDto } from '../infrastructures/dtos/user/createUser.dto';

export class UserMap {
	static entityToDto(entity: UserEntity): UserDto {
		const config = new ConfigService();
		const url = config.get('DOMAIN');
		const userDto = new UserDto();
		if (entity.avatar.includes('https://')) {
			userDto.avatar = entity.avatar;
		} else {
			userDto.avatar = url + entity.avatar;
		}

		userDto.email = entity.email;
		userDto.phone = entity.phone;
		userDto.username = entity.username;
		userDto.gender = entity.gender;
		userDto.firstName = entity.firstName;
		userDto.lastName = entity.lastName;
		userDto.role = entity.role;
		userDto.birthday = entity.birthday;
		userDto.createdAt = entity.createdAt;
		userDto.updatedAt = entity.updatedAt;
		return userDto;
	}

	static dtoToEntity(dto: UserDto): UserEntity {
		const entity = new UserEntity();
		entity.id = dto.id;
		entity.avatar = dto.avatar;
		entity.email = dto.email;
		entity.phone = dto.phone;
		entity.username = dto.username;
		entity.password = dto.password;
		entity.firstName = dto.firstName;
		entity.lastName = dto.lastName;
		entity.role = dto.role;
		entity.birthday = dto.birthday;
		entity.gender = dto.gender;
		return entity;
	}

	static entityToDomain(entity: UserEntity) {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const userOrError = UserDomain.create(
			{
				username: entity.username,
				email: entity.email,
				phone: entity.phone,
				firstName: entity.firstName,
				lastName: entity.lastName,
				role: entity.role,
				avatar: entity.avatar,
				birthday: entity.birthday,
				password: entity.password,
				gender: entity.gender,
			},
			new UniqueEntityID(id),
		);
		return userOrError.isSuccess ? userOrError.getValue() : null;
	}

	static toEntity(domain: UserDomain): UserEntity {
		const entity = new UserEntity();
		entity.id = domain.id.toValue();
		entity.avatar = domain.avatar;
		entity.email = domain.email;
		entity.phone = domain.phone;
		entity.username = domain.username;
		entity.password = domain.password;
		entity.firstName = domain.firstName;
		entity.lastName = domain.lastName;
		entity.role = domain.role;
		entity.birthday = domain.birthday;
		entity.gender = domain.gender;
		return entity;
	}

	static toDto(domain: UserDomain): UserDto {
		const config = new ConfigService();
		const url = config.get('DOMAIN');
		const userDto = new UserDto();
		userDto.id = domain.id.toValue();
		if (domain.avatar.includes('https://')) {
			userDto.avatar = domain.avatar;
		} else {
			userDto.avatar = url + domain.avatar;
		}

		userDto.email = domain.email;
		userDto.phone = domain.phone;
		userDto.username = domain.username;
		userDto.firstName = domain.firstName;
		userDto.lastName = domain.lastName;
		userDto.role = domain.role;
		userDto.birthday = domain.birthday;
		userDto.gender = domain.gender;
		return userDto;
	}

	static entitiesToDomains(entities: UserEntity[]): UserDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}

	static dtoToDomain(dto: CreateUserDto): UserDomain {
		if (!dto) {
			return null;
		}

		if (dto.phone && dto.phone === '') {
			dto.phone = undefined;
		}

		const userOrError = UserDomain.create({
			username: dto.username.trim(),
			email: dto.email.trim(),
			phone: dto.phone.trim(),
			firstName: dto.firstName.trim(),
			lastName: dto.lastName.trim(),
			avatar: dto.avatar,
			birthday: dto.birthday,
			password: dto.password.trim(),
			gender: dto.gender,
		});
		return userOrError.isSuccess ? userOrError.getValue() : null;
	}

	static toShortDto(domain: UserDomain): UserShortDto {
		const config = new ConfigService();
		const url = config.get('DOMAIN');
		const userDto = new UserShortDto();
		if (domain.avatar.includes('https://')) {
			userDto.avatar = domain.avatar;
		} else {
			userDto.avatar = url + domain.avatar;
		}

		userDto.firstName = domain.firstName;
		userDto.lastName = domain.lastName;
		userDto.email = domain.email;
		return userDto;
	}
}
