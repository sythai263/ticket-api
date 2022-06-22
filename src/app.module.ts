import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GoogleAuthModule } from './modules/google-auth/google-auth.module';
import { JwtAuthModule } from './modules/jwtAuth/jwtAuth.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './modules/login/login.module';

@Module({
	imports: [
		TicketModule,
		TypeOrmModule.forRootAsync({
			imports: [SharedModule],
			useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
			inject: [ConfigService],
		}),
		GoogleAuthModule,
		JwtAuthModule,
		LoginModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
