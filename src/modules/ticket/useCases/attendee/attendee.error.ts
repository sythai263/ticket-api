import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace AttendeeErrors {
	export class NotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Không tìm thấy mã đăng ký này',
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

	export class Forbidden extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Forbidden !!!',
			} as UseCaseError);
		}
	}
}
