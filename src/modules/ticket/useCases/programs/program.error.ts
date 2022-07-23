import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace ProgramErrors {
	export class NotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Không tìm thấy chương trình này!',
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
}
