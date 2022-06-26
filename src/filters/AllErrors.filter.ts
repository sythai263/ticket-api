/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { STATUS_CODES } from 'http';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);
	public reflector: Reflector;
	constructor(reflector: Reflector) {
		this.reflector = reflector;
	}

	catch(exception: HttpException, host: ArgumentsHost): Response {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const statusCode = exception.getStatus
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		this.logger.error(exception);
		const r: any = exception.getResponse ? exception.getResponse() : {};

		r.statusCode = statusCode;
		r.error = STATUS_CODES[statusCode];

		return response.status(statusCode).json(r);
	}
}
