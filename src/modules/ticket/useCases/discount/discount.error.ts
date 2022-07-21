import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace DiscountErrors {
	export class NotFound extends Result<UseCaseError> {
		constructor(code?: string) {
			super(false, {
				message: `Mã giảm giá ${code} không tồn tại này!`,
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
