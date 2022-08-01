import {
	Controller,
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
import { RolesGuard } from '../../../../guards/roles.guard';
import FilesInterceptor from '../../../../interceptors/file.interceptor';
import { ConfigService } from '../../../../shared/services/config.service';
import { saveImage } from '../../../../utils/saveImage';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';
import { UploadDto } from '../../infrastructures/dtos/upload';

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
	constructor(private configService: ConfigService) {}

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
  @UseInterceptors(
  	FilesInterceptor({
  		fieldName: 'file',
  		path: './',
  	}),
  )
	@ApiResponse({
		type: UploadDto
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
	): Promise<UploadDto> {
		const url = await saveImage(file, mode);
		return new UploadDto(url);
	}

}
