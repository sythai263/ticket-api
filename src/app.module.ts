import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { DataSource } from 'typeorm';

import { GoogleAuthModule } from './modules/google-auth/google-auth.module';
import { JwtAuthModule } from './modules/jwtAuth/jwtAuth.module';
import { LoginModule } from './modules/login/login.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [SharedModule],
			useFactory: (configService: ConfigService) => configService.typeOrmConfig,
			inject: [ConfigService],
		}),

		ConfigModule.forRoot({
			validationSchema: Joi.object({
				UPLOADED_FILES_DESTINATION: Joi.string(),
				// ...
			}),
		}),
		GoogleAuthModule,
		TicketModule,
		JwtAuthModule,
		LoginModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	constructor(public dataSource: DataSource) {}
}
