import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

import { ConstraintErrors } from './ConstraintErrors';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
	public reflector: Reflector;
	constructor(reflector: Reflector) {
		this.reflector = reflector;
	}

	catch(exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const errorMessage = ConstraintErrors[exception.constraint];

		const status
      = exception.constraint && exception.constraint.startsWith('UQ') ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR;

		response.status(status).json({
			statusCode: status,
			error: STATUS_CODES[status],
			message: errorMessage,
		});
	}
}
