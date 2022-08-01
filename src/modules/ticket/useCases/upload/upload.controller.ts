import {
	Controller,
	Inject,
	Param,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOperation, ApiParam, ApiResponse, ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Request } from 'express';
import { join } from 'path';

import { ModeImage } from '../../../../common/constants/modeImage';
import { RoleType } from '../../../../common/constants/roleType';
import { Roles } from '../../../../decorators/Roles.decorator';
import { ImageEntity } from '../../../../entities';
import { RolesGuard } from '../../../../guards/roles.guard';
import FilesInterceptor from '../../../../interceptors/file.interceptor';
import { ConfigService } from '../../../../shared/services/config.service';
import { saveImage } from '../../../../utils/saveImage';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { JwtPayload } from '../../../jwtAuth/jwtAuth.strategy';
import { ImageDto } from '../../infrastructures/dtos/image';
import { ImageMap } from '../../mapper';
import { ImageRepository } from '../../repositories';

const imageURL = join(
	__dirname,
	'..',
	'..',
	'..',
	'..',
	'..',
	'public',
	'assets',
	'upload',
	'images',
);

@Controller('api/upload/:mode')
@ApiTags('Upload file')
export class UploadController {
	constructor(
		private configService: ConfigService,
		@Inject('ImageRepository') public readonly repo: ImageRepository,

	) {}

  @Post('image')
  @ApiBearerAuth()
  @ApiOperation({
  	description: 'Upload hình ảnh',
  	summary: 'Upload hình ảnh',
  })
	@ApiParam({
		name: 'mode',
		enum: ModeImage
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
  @UseInterceptors(
  	FilesInterceptor({
  		fieldName: 'file',
  		path: './',
  	}),
  )
	@ApiResponse({
		type: ImageDto
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN)
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
	async uploadImage(
    @Req() req: Request,
		@UploadedFile() file: Express.Multer.File,
		@Param('mode') mode: ModeImage,
	): Promise<ImageDto> {
		const user = req.user as JwtPayload;
		const url = await saveImage(file, mode);
		if (mode === ModeImage.PRODUCT) {
			const image = new ImageEntity(url);
			image.createdBy = user.id;
			image.updatedBy = user.id;
			const domain = await this.repo.save(image);
			const dto = ImageMap.toDto(domain);
			return dto;
		}

		return new ImageDto(url);
	}

}
