
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Import { SnakeNamingStrategy } from '../../snake-naming.strategy';
export class ConfigService {
	constructor() {
		const { nodeEnv } = this;
		dotenv.config({
			path: `.${nodeEnv}.env`,
		});

		// Replace \\n with \n to support multiline strings in AWS
		for (const envName of Object.keys(process.env)) {
			process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
		}
	}

	public get(key: string, defaultValue: string = null): string {
		return process.env[key] ?? defaultValue;
	}

	public getNumber(key: string): number {
		return Number(this.get(key));
	}

	get nodeEnv(): string {
		return this.get('NODE_ENV') || 'development';
	}

	get typeOrmConfig(): TypeOrmModuleOptions {
		let entities = [__dirname + '/../../entities/**/*.entity{.ts,.js}'];
    let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

		if ((<any>module).hot) {
			const entityContext = (<any>require).context(
				'./../../entities',
				true,
				/\.entity\.ts$/,
			);
			entities = entityContext.keys().map((id: any) => {
				const entityModule = entityContext(id);
				const [entity] = Object.values(entityModule);
				return entity;
			});
			const migrationContext = (<any>require).context(
				'./../../migrations',
				false,
				/\.ts$/,
			);
			migrations = migrationContext.keys().map((id: any) => {
				const migrationModule = migrationContext(id);
				const [migration] = Object.values(migrationModule);
				return migration;
			});
		}

		console.log(this.get('DB_USERNAME'));
		return {
			entities,
			migrations,
			keepConnectionAlive: true,
			type: 'mysql',
			host: this.get('DB_HOST'),
			port: this.getNumber('DB_PORT'),
			username: this.get('DB_USERNAME'),
			password: this.get('DB_PASSWORD'),
			database: this.get('DB_DATABASE'),
			migrationsRun: true,
			logging: this.nodeEnv === 'development',
		};
	}

}
