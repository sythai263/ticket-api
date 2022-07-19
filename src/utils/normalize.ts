import * as moment from 'moment';

function generateFilename(str: string) {
	const ext = str.split('.').pop();
	str = str.replace(`.${ext}`, '');
	str = str.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd').replace(/Đ/g, 'D')
		.replace(/\s/g, '_');
	return `${str}_${moment().format('YYYYMMDD_hhmmss')}.${ext.toLowerCase()}`;
}

function removeAccents(str: string) {
	return str.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export { generateFilename, removeAccents };
