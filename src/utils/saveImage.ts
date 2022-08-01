import * as fs from 'fs';
import * as Jimp from 'jimp';
import { join } from 'path';

import { ModeImage } from '../common/constants/modeImage';
import { ConfigService } from '../shared/services/config.service';
import { generateFilename } from './normalize';
async function saveImage(file: Express.Multer.File, mode: ModeImage): Promise<string> {
	const configService = new ConfigService();
	const imageURL = join(__dirname, '..','..', configService.get('UPLOADED_FILES_DESTINATION'));

	const image = await Jimp.read(join(imageURL, file.filename));
  	const filename = generateFilename(file.originalname);
  	if (file.size > 200 * 1024) {
  		const width = image.getHeight() / 2;
  		const height = image.getWidth() / 2;
  		const ext = file.originalname.split('.').pop();
  		if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg') {
  			image.resize(width, height).quality(80);
  		} else if (ext.toLowerCase() === 'png') {
  			image.resize(width, height);
  		}
  	}

  	const urlImage = configService.get('UPLOAD_FOLDER');
  	await image.writeAsync(join(__dirname, '..','..', urlImage, mode, filename));
  	fs.unlinkSync(join(imageURL, file.filename));
  	return `assets/upload/${mode}/${filename}` ;
}

export { saveImage };
