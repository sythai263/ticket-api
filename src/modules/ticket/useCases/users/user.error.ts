import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetUserErrors {
  export class UserNotFound extends Result<UseCaseError> {
  	constructor() {
  		super(false, {
  			message: 'The user is not found',
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
  	constructor(err: string ) {
  		super(false, {
  			message: err,
  		} as UseCaseError);
  	}
	}

	export class UserNotVerify extends Result<UseCaseError> {
  	constructor() {
  		super(false, {
  			message: 'The user is not verify, check email and verify this account !',
  		} as UseCaseError);
  	}
	}
}
