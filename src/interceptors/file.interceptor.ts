import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join } from 'path';

import { ConfigService } from '../shared/services/config.service';

interface FilesInterceptorOptions {
  fieldName: string;
  path?: string;
}

function FilesInterceptor(options: FilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
	class Interceptor implements NestInterceptor {
  	fileInterceptor: NestInterceptor;
  	constructor(configService: ConfigService) {
  		const filesDestination = configService.get('UPLOADED_FILES_DESTINATION');

  		const destination = join(filesDestination, options.path);

  		const multerOptions: MulterOptions = {
  			storage: diskStorage({
  				destination,
  			}),
  		};

  		this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))();
  	}

  	intercept(...args: Parameters<NestInterceptor['intercept']>) {
  		return this.fileInterceptor.intercept(...args);
  	}
  }
  return mixin(Interceptor);
}

// eslint-disable-next-line import/no-default-export
export default FilesInterceptor;
