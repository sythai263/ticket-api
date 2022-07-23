import * as moment from 'moment';
import { join } from 'path';
import { toFile } from 'qrcode';

import { STATIC_FOLDER } from '../../common/constants/system';
import { CreateAttendeeDto } from '../../modules/ticket/infrastructures/dtos/attendee';

const urlQR = join(__dirname,'..', '..', '..',STATIC_FOLDER);

export async function generateQRCode(dto: CreateAttendeeDto, attendeeID: number): Promise<string> {
	const now = moment().format('YYYY-MM-DD');
	const qrFilename = `${dto.username}_attend_${dto.programId}_${now}.png`;
	const content = `${dto.userId}>>${dto.username}>>${dto.programId}>>${attendeeID}`;
	await toFile(join(urlQR, qrFilename), content);
	return join(STATIC_FOLDER, qrFilename);
}
