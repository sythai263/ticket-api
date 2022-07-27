import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { UserDomain } from '../../../domain';
import { ProgramDomain } from '../../../domain/program.domain';
import { ProgramEntity } from '../../../entities/program.entity';
import { ConfigService } from '../../../shared/services/config.service';
import { CreateProgramDto } from '../infrastructures/dtos/program/createProgram.dto';
import { ProgramDto } from '../infrastructures/dtos/program/program.dto';
import { ProgramItemsDto } from '../infrastructures/dtos/programItem';
import { ProductMap } from './product.mapper';
import { UserMap } from './user.mapper';

export class ProgramMap {
  static entityToDto(entity: ProgramEntity): ProgramDto {
    const config = new ConfigService();
    const url = config.get('UPLOAD_URL');
    const dto = new ProgramDto();
    dto.id = entity.id;
    dto.total = entity.total;
    dto.avatar = entity.avatar;
    dto.price = entity.price;
    dto.avatar = url + entity.avatar;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    dto.name = entity.name;
    dto.remain = entity.total;
    dto.description = entity.description;
    dto.place = entity.place;
    dto.allowCheckIn = entity.allowCheckIn;
    dto.imageQR = entity.imageQR;
    return dto;
  }

  static dtoToEntity(dto: ProgramDto): ProgramEntity {
    const entity = new ProgramEntity();
    entity.total = dto.total;
    entity.avatar = dto.avatar;
    entity.price = dto.price;
    entity.avatar = dto.avatar;
    entity.startDate = dto.startDate;
    entity.endDate = dto.endDate;
    entity.name = dto.name;
    entity.description = dto.description;
    entity.place = dto.place;
    entity.imageQR = dto.imageQR;

    return entity;
  }

  static createDtoToEntity(dto: CreateProgramDto): ProgramEntity {
    const entity = new ProgramEntity();
    entity.total = dto.total;
    entity.avatar = dto.avatar;
    entity.price = dto.price;
    entity.avatar = dto.avatar;
    entity.startDate = dto.startDate;
    entity.endDate = dto.endDate;
    entity.name = dto.name;
    entity.description = dto.description;
    entity.place = dto.place;
    return entity;
  }

  static entityToDomain(entity: ProgramEntity) {
    if (!entity) {
      return null;
    }

    let attendees = new Array<UserDomain>();
    if (entity.attendees) {
      attendees = entity.attendees.map((attendee) =>
        UserMap.entityToDomain(attendee.user),
      );
    }

    const { id } = entity;

    const programOrError = ProgramDomain.create(
      {
        total: entity.total,
        avatar: entity.avatar,
        description: entity.description,
        endDate: entity.endDate,
        startDate: entity.startDate,
        name: entity.name,
        price: entity.price,
        place: entity.place,
        allowCheckIn: entity.allowCheckIn,
        imageQR: entity.imageQR,
        attendees,
      },
      new UniqueEntityID(id),
    );
    return programOrError.isSuccess ? programOrError.getValue() : null;
  }

  static toEntity(domain: ProgramDomain): ProgramEntity {
    const entity = new ProgramEntity();
    entity.id = domain.id.toValue();
    entity.total = domain.total;
    entity.avatar = domain.avatar;
    entity.price = domain.price;
    entity.avatar = domain.avatar;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.place = domain.place;
    entity.imageQR = domain.imageQR;
    entity.allowCheckIn = domain.allowCheckIn;
    return entity;
  }

  static toDto(domain: ProgramDomain): ProgramDto {
    const config = new ConfigService();
    const url = config.get('UPLOAD_URL');
    const dto = new ProgramDto();
    dto.id = domain.id.toValue();
    dto.total = domain.total;
    dto.avatar = domain.avatar;
    dto.price = domain.price;
    dto.avatar = url + domain.avatar;
    dto.startDate = domain.startDate;
    dto.endDate = domain.endDate;
    dto.name = domain.name;
    dto.remain = domain.remain;
    dto.description = domain.description;
    dto.place = domain.place;
    dto.imageQR = domain.imageQR;
    dto.allowCheckIn = domain.allowCheckIn;

    return dto;
  }

  static toDtos(domains: ProgramDomain[]): ProgramDto[] {
    if (domains) {
      const dto = domains.map((domain) => this.toDto(domain));
      return dto;
    }

    return null;
  }

  static toProgramItemDto(domain: ProgramDomain): ProgramItemsDto {
    if (domain) {
      const program = this.toDto(domain);
      const products = ProductMap.toDtos(domain.products);
      return new ProgramItemsDto(program, products);
    }

    return null;
  }

  static entitiesToDomains(entities: ProgramEntity[]): ProgramDomain[] {
    const domains = entities.map((entity) => this.entityToDomain(entity));
    return domains;
  }

  static dtoToDomain(dto: CreateProgramDto): ProgramDomain {
    if (!dto) {
      return null;
    }

    const programOrError = ProgramDomain.create({
      total: dto.total,
      avatar: dto.avatar,
      description: dto.description,
      endDate: dto.endDate,
      startDate: dto.startDate,
      name: dto.name,
      price: dto.price,
      place: dto.place,
    });
    return programOrError.isSuccess ? programOrError.getValue() : null;
  }
}
