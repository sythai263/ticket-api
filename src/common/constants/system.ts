import { join } from 'path';

export const SYSTEM = -1;
export const ANOTHER_SYSTEM = -2;
export const VNPAY_SYSTEM = -3;
export const STATIC_FOLDER = join('public');
export const QR_FOLDER = join('assets', 'qr');
export const REGEX_PHONE_NUMBER = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
