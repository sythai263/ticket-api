import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ReviewProgramDomain } from '../../../domain';
import { ProgramEntity, ReviewProgramEntity, UserEntity } from '../../../entities';
import { CreateReviewProgramDto, ReviewProgramDto } from '../infrastructures/dtos/reviewProgram';
import { ProgramMap } from './program.mapper';
import { UserMap } from './user.mapper';

export class ReviewProgramMap {
	static entityToDto(entity: ReviewProgramEntity): ReviewProgramDto {
		const dto = new ReviewProgramDto();
		dto.id = entity.id;
		dto.star = entity.star;
		dto.comment = entity.comment;
		dto.user = UserMap.entityToDto(entity.user);
		return dto;
	}

	static dtoToEntity(dto: ReviewProgramDto): ReviewProgramEntity {
		const entity = new ReviewProgramEntity();
		entity.id = dto.id;
		entity.star = dto.star;
		entity.comment = dto.comment;
		return entity;
	}

	static createDtoToEntity(dto: CreateReviewProgramDto): ReviewProgramEntity {
		const entity = new ReviewProgramEntity();
		entity.program = new ProgramEntity(dto.programId);
		entity.comment = dto.comment;
		entity.star = dto.star;
		entity.user = new UserEntity(dto.userId);
		entity.createdBy = dto.userId;
		entity.updatedBy = dto.userId;
		return entity;
	}

	static entityToDomain(entity: ReviewProgramEntity): ReviewProgramDomain {
		if (!entity) {
			return null;
		}

		const { id } = entity;
		const discountOrError = ReviewProgramDomain.create(
			{
				user: UserMap.entityToDomain(entity.user),
				program: ProgramMap.entityToDomain(entity.program),
				comment: entity.comment,
				star: entity.star,
				createdAt: entity.createdAt,
			},
			new UniqueEntityID(id),
		);
		return discountOrError.isSuccess ? discountOrError.getValue() : null;
	}

	static toEntity(domain: ReviewProgramDomain): ReviewProgramEntity {
		const entity = new ReviewProgramEntity();
		entity.id = domain.id.toValue();
		entity.program = ProgramMap.toEntity(domain.program);
		entity.comment = domain.comment;
		entity.star = domain.star;
		entity.user = UserMap.toEntity(domain.user);
		entity.createdAt = domain.createdAt;
		return entity;
	}

	static toDto(domain: ReviewProgramDomain, userId?: number): ReviewProgramDto {
		const dto = new ReviewProgramDto();
		dto.id = domain.id.toValue();
		dto.comment = domain.comment;
		dto.star = domain.star;
		dto.user = UserMap.toShortDto(domain.user);
		dto.user.email = undefined;
		dto.createAt = domain.createdAt;
		if (domain.user.isMe(userId)) {
			dto.canUpdate = true;
		} else {
			dto.canUpdate = false;
		}

		return dto;
	}

	static toDtos(domains: ReviewProgramDomain[], userId?: number): ReviewProgramDto[] {
		if (domains) {
			const dto = domains.map((domain) => this.toDto(domain, userId));
			return dto;
		}

		return null;
	}

	static entitiesToDomains(entities: ReviewProgramEntity[]): ReviewProgramDomain[] {
		const domains = entities.map((entity) => this.entityToDomain(entity));
		return domains;
	}
}
