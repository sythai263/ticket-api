import { Module } from '@nestjs/common';

import { JwtAuthModule } from '../jwtAuth/jwtAuth.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
	imports:[JwtAuthModule],
	controllers: [LoginController],
	providers: [LoginService]
})

export class LoginModule {}
