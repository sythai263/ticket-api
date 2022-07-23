import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../entities/user.entity';
import { UserLoginDto } from './user.dto';
import { UserAuthMap } from './user.mapper';

export interface IUserAuthRepo {
  findByEmail(email: string): Promise<UserLoginDto>;
  findByUsername(username: string): Promise<UserLoginDto>;
  save(user: UserEntity): Promise<UserLoginDto>;
}

@Injectable()
export class UserAuthRepository implements IUserAuthRepo {
	constructor(
    @InjectRepository(UserEntity)
    protected repo: Repository<UserEntity>,
	) {}

	async findByUsername(username: string): Promise<UserLoginDto> {
		const entity = await this.repo.findOne({
			where: {
				username,
			},
		});
		if (entity) {
			return UserAuthMap.entityToDto(entity);
		}

		return null;
	}

	async findByEmail(email: string): Promise<UserLoginDto> {
		const entity = await this.repo.findOne({
			where: {
				email,
			},
		});
		if (entity) {
			return UserAuthMap.entityToDto(entity);
		}

		return null;
	}

	async save(user: UserEntity): Promise<UserLoginDto> {
		try {
			const entity = await this.repo.save(user);

			return UserAuthMap.entityToDto(entity);
		} catch (err) {
			return null;
		}
	}
}
