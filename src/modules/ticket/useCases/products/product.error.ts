import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace ProductErrors {
	export class NotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: 'The product is not found',
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
