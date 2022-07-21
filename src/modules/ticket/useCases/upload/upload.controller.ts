import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import * as fs from 'fs';
import * as Jimp from 'jimp';
import { join } from 'path';

import { STATIC_FOLDER } from '../../../../common/constants/system';
import FilesInterceptor from '../../../../interceptors/file.interceptor';
import { generateFilename } from '../../../../utils/normalize';
import { JwtAuthGuard } from '../../../jwtAuth/jwtAuth.guard';

const imageURL = join(__dirname,'..', '..', '..', '..','..',STATIC_FOLDER, 'assets', 'upload', 'images');

@Controller('api/upload')
@ApiTags('Upload file')
export class UploadController {
	constructor(
	) {}

	@Post('image')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Upload hình ảnh',
		summary:'Upload hình ảnh'
	})
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FilesInterceptor({
		fieldName: 'file',
		path: 'images'
	}))

	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	async uploadImage(@Req() req: Request,
		@UploadedFile() file: Express.Multer.File) {
		const image = await Jimp.read(join(imageURL, file.filename));
		const filename = generateFilename(file.originalname);
		if (file.size > 200 * 1024) {
			const width = image.getHeight() / 2;
			const height = image.getWidth() / 2;
			const ext = file.originalname.split('.').pop();
			if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg') {
				image.resize(width, height).quality(80);
			} else if (ext.toLowerCase() === 'png'){
				image.resize(width, height);
			}
		}

		await image.writeAsync(join(imageURL, filename));
		fs.unlinkSync(join(imageURL, file.filename));
		return { image: `/assets/upload/images/${filename}` };
	}

	@Post('avatar')
	@ApiBearerAuth()
	@ApiOperation({
		description: 'Upload avatar',
		summary:'Upload avatar'
	})
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FilesInterceptor({
		fieldName: 'avatar',
		path: 'images'
	}))

	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@ApiForbiddenResponse({
		description: 'Forbidden'
	})
	@ApiBadRequestResponse({
		description: 'Bad Request'
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error'
	})
	async uploadAvatar(@Req() req: Request,
		@UploadedFile() file: Express.Multer.File) {
		const image = await Jimp.read(join(imageURL, file.filename));
		const filename = generateFilename(file.originalname);
		if (file.size > 200 * 1024) {
			const width = image.getHeight() / 2;
			const height = image.getWidth() / 2;
			const ext = file.originalname.split('.').pop();
			if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg') {
				image.resize(width, height).quality(80);
			} else if (ext.toLowerCase() === 'png'){
				image.resize(width, height);
			}
		}

		await image.writeAsync(join(imageURL, filename));
		fs.unlinkSync(join(imageURL, file.filename));
		return { image: `/assets/avatars/${filename}` };
	}
}
