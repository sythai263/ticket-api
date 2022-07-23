import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace PaymentErrors {
	export class NotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Không tìm thấy hóa đơn này',
			} as UseCaseError);
		}
	}
	export class Error extends Result<UseCaseError> {
		constructor(err: string) {
			super(false, {
				message: err,
			} as UseCaseError);
		}
	}

	export class Paid extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Đơn hàng này đã được thanh toán !',
			} as UseCaseError);
		}
	}

	export class Forbidden extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Forbidden !!!',
			} as UseCaseError);
		}
	}

	export class NotEnoughMoney extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Số tiền không hợp lệ !',
			} as UseCaseError);
		}
	}
}
