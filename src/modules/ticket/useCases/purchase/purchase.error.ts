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

	export class NotFound extends Result<UseCaseError> {
		constructor(id: number) {
			super(false, {
				message: 'Không tìm thấy đơn hàng này!',
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
				message: 'Không đủ quyền truy cập!',
			} as UseCaseError);
		}
	}
}
