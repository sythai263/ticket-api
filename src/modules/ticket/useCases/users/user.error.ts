import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetUserErrors {
	export class UserNotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Tài khoản này không tồn tại!',
			} as UseCaseError);
		}
	}
	export class ErrorPassword extends Result<UseCaseError> {
		constructor(err: string) {
			super(false, {
				message: err,
			} as UseCaseError);
		}
	}

	export class ErrorUser extends Result<UseCaseError> {
		constructor(err: string) {
			super(false, {
				message: err,
			} as UseCaseError);
		}
	}

	export class UserNotVerify extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message:
					'Tài khoản này chưa được xác minh, kiểm tra email và xác minh tài khoản này !',
			} as UseCaseError);
		}
	}
}
