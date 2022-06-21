import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
	imports: [
		TicketModule,
		AuthModule,
		TypeOrmModule.forRootAsync({
			imports: [SharedModule],
			inject: [ConfigService],
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
