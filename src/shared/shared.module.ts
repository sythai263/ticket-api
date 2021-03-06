import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from './services/config.service';
import { ValidatorService } from './services/validator.service';

const providers = [ConfigService, ValidatorService];

@Global()
@Module({
	providers,
	imports: [
		HttpModule,
		JwtModule.registerAsync({
			imports: [],
			useFactory: (configService: ConfigService) => ({
				secretOrPrivateKey: configService.get('JWT_SECRET'),
			}),
			inject: [ConfigService],
		}),
	],
	exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}
