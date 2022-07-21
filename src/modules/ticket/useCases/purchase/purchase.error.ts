import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace PurchaseErrors {
	export class NotFoundProducts extends Result<UseCaseError> {
		constructor(ids: number[]) {
			super(false, {
				message: `Không tìm thấy các sản phẩm ${ids.join()} này!`,
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
