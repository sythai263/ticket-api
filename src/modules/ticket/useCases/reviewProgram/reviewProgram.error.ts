import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace ReviewProgramErrors {
	export class NotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'Chưa có đánh giá nào!',
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
				message: 'Không thể sửa/xóa đánh giá của người khác !',
			} as UseCaseError);
		}
	}
}
