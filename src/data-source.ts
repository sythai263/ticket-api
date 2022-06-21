import "reflect-metadata";

import * as dotenv from 'dotenv';
import { DataSource } from "typeorm";

const nodeEnv = process.env.NODE_ENV;
dotenv.config({
			path: `.${nodeEnv}.env`
		});

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST/* ||'localhost' */,
    port: Number(process.env.DB_PORT/* ||3306 */),
    username: process.env.DB_USERNAME/* ||'ticket' */,
    password: process.env.DB_PASSWORD/* ||'ticket123' */,
    database: process.env.DB_DATABASE/* ||'ticket' */,
    synchronize: true,
    logging: false,
    entities: [
        "src/**/*.entity.{ts,js}"
    ],
    migrations: [
        "src/migrations/*.{ts,js}"
	],
		
});
