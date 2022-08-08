import { Result } from '../../core/logic/Result';
import { UseCaseError } from '../../core/logic/UseCaseError';

export namespace GetUserErrors {
	export class UserNotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Tài khoản này không tồn tại !',
			} as UseCaseError);
		}
	}
	export class PasswordWrong extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Sai mật khẩu !',
			} as UseCaseError);
		}
	}
}
