import * as fs from 'fs';
import * as Jimp from 'jimp';
import { join } from 'path';

import { ModeImage } from '../common/constants/modeImage';
import { ConfigService } from '../shared/services/config.service';
import { generateFilename } from './normalize';
async function saveImage(file: Express.Multer.File, mode: ModeImage): Promise<string> {
	const configService = new ConfigService();
	const imageURL = join(__dirname, '..', '..', configService.get('UPLOADED_FILES_DESTINATION'));

	const image = await Jimp.read(join(imageURL, file.filename));
	const filename = generateFilename(file.originalname);
	if (file.size > 200 * 1024) {
		const ext = file.originalname.split('.').pop();
		if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg') {
			image.quality(65);
		}
	}

	const urlImage = configService.get('UPLOAD_FOLDER');
	await image.writeAsync(join(urlImage, mode, filename));
	fs.unlinkSync(join(imageURL, file.filename));
	return `assets/upload/${mode}/${filename}`;
}

export { saveImage };
