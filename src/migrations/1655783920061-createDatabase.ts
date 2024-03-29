import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createDatabase1655783920061 implements MigrationInterface {
	name = 'createDatabase1655783920061';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
CREATE TABLE user (
	id int NOT NULL AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	phone varchar(15) NULL,
	email varchar(255) NOT NULL,
	birthday date NULL,
	gender enum ('Male', 'Female', 'LGBT') NULL,
	avatar varchar(255) NULL,
	role enum ('User', 'Admin') NOT NULL DEFAULT 'User',
	verify tinyint(1) NOT NULL DEFAULT 0,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	UNIQUE INDEX IDX_USER_USERNAME (username),
	UNIQUE INDEX IDX_USER_PHONE (phone),
	UNIQUE INDEX IDX_USER_EMAIL (email),
	UNIQUE INDEX UQ_USERNAME (username),
	UNIQUE INDEX UQ_USER_EMAIL (email),
	UNIQUE INDEX UQ_USER_PHONE (phone),
	PRIMARY KEY (id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE product (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	total int NOT NULL,
	price int NOT NULL,
	description text NOT NULL,
	avatar varchar(255) NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	PRIMARY KEY (id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE program (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	start_date timestamp NULL,
	end_date timestamp NULL,
	place varchar(500) NOT NULL,
	total int NOT NULL,
	price int NOT NULL,
	description text NOT NULL,
	avatar varchar(255) NULL,
	image_qr varchar(255) NULL,
	allow_check_in tinyint(1) NOT NULL DEFAULT 0,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	PRIMARY KEY (id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE invoice (
	id int NOT NULL AUTO_INCREMENT,
	amount int NOT NULL,
	currency_code enum ('USD', 'VND', 'EUR', 'GBP') NOT NULL DEFAULT 'VND',
	bank_code varchar(50) NULL,
	bank_trans_no varchar(50) NULL,
	card_type varchar(50) NULL,
	pay_date timestamp NULL,
	info varchar(255) NOT NULL,
	status varchar(255) NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int,
	UNIQUE INDEX IDX_BANK_TRANS_NO (bank_trans_no),
	PRIMARY KEY (id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE program_item (
	id int NOT NULL AUTO_INCREMENT,
	program_id int NOT NULL,
	product_id int NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int,
	UNIQUE INDEX UQ_PROGRAM_ITEM (program_id, product_id),
	PRIMARY KEY (id),
	CONSTRAINT FK_ITEM_PRODUCT FOREIGN KEY (product_id) REFERENCES product(id),
	CONSTRAINT FK_ITEM_USER FOREIGN KEY (program_id) REFERENCES program(id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE image (
	id int NOT NULL AUTO_INCREMENT,
	product_id int NOT NULL,
	alt varchar(500) NULL,
	url varchar(255),
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int,
	PRIMARY KEY (id),
	CONSTRAINT FK_IMAGE_PRODUCT FOREIGN KEY (product_id) REFERENCES product(id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE attendee (
	id int NOT NULL AUTO_INCREMENT,
	user_id int NOT NULL,
	program_id int NOT NULL,
	invoice_id int NULL,
	image_qr varchar(255) NULL,
	is_check_in tinyint(1) NOT NULL DEFAULT 0,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	UNIQUE INDEX UQ_ATTENDEE (user_id, program_id),
	CONSTRAINT FK_ATTENDEE_USER FOREIGN KEY (user_id) REFERENCES user(id),
	CONSTRAINT FK_ATTENDEE_PROGRAM FOREIGN KEY (program_id) REFERENCES program(id),
	CONSTRAINT FK_ATTENDEE_INVOICE FOREIGN KEY (invoice_id) REFERENCES invoice(id),
	PRIMARY KEY (id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE discount (
	id int NOT NULL AUTO_INCREMENT,
	code varchar(15) NOT NULL,
	program_id int NOT NULL,
	start_date datetime NOT NULL,
	expired_date datetime NOT NULL,
	discount int NOT NULL,
	description text NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	UNIQUE INDEX UQ_DISCOUNT (code),
	CONSTRAINT FK_DISCOUNT_PROGRAM FOREIGN KEY (program_id) REFERENCES program(id),
	PRIMARY KEY (id)
) ENGINE = InnoDB
			`);

		await queryRunner.query(`
CREATE TABLE review_product (
	id int NOT NULL AUTO_INCREMENT,
	star int NOT NULL,
	user_id int NOT NULL,
	product_id int NOT NULL,
	comment text NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	UNIQUE INDEX UQ_REVIEW_PRODUCT (user_id, product_id),
	PRIMARY KEY (id),
	CONSTRAINT FK_REVIEW_PRODUCT_USER FOREIGN KEY (user_id) REFERENCES user (id),
	CONSTRAINT FK_REVIEW_PRODUCT_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id)
) ENGINE = InnoDB
`);
		await queryRunner.query(`
CREATE TABLE review_program (
	id int NOT NULL AUTO_INCREMENT,
	program_id int NOT NULL,
	user_id int NOT NULL,
	star int NOT NULL,
	comment text NOT NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	UNIQUE INDEX UQ_REVIEW_PROGRAM (user_id, program_id),
	CONSTRAINT FK_REVIEW_PROGRAM_USER FOREIGN KEY (user_id) REFERENCES user (id),
	CONSTRAINT FK_REVIEW_PROGRAM_PROGRAM FOREIGN KEY (program_id) REFERENCES program (id),
	PRIMARY KEY (id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE purchase (
	id int NOT NULL AUTO_INCREMENT,
	order_date timestamp NOT NULL,
	user_id int NULL,
	invoice_id int NULL,
	status enum ('Delivered', 'Preparing', 'Confirmed', 'Received', 'Shipping', 'Ordered') NULL DEFAULT 'Ordered', 
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int,
	UNIQUE INDEX REL_INVOICE_ID (invoice_id),
	PRIMARY KEY (id),
	CONSTRAINT FK_ORDER_USER FOREIGN KEY (user_id) REFERENCES user(id),
	CONSTRAINT FK_ORDER_INVOICE FOREIGN KEY (invoice_id) REFERENCES invoice(id)
) ENGINE = InnoDB
`);

		await queryRunner.query(`
CREATE TABLE detail_order (
	id int NOT NULL AUTO_INCREMENT,
	product_id int NULL,
	discount_id int NULL,
	amount int NOT NULL,
	purchase_id int NULL,
	created_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	deleted_at timestamp NULL,
	created_by int NOT NULL,
	updated_by int NOT NULL,
	deleted_by int NULL,
	CONSTRAINT FK_DETAIL_ORDER_PURCHASE FOREIGN KEY (purchase_id) REFERENCES purchase(id),
	CONSTRAINT FK_DETAIL_ORDER_PRODUCT FOREIGN KEY (product_id) REFERENCES product (id),
	CONSTRAINT FK_DETAIL_ORDER_DISCOUNT FOREIGN KEY (discount_id) REFERENCES discount (id),
	PRIMARY KEY (id)
) ENGINE = InnoDB
`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE detail_order');
		await queryRunner.query('DROP TABLE purchase');
		await queryRunner.query('DROP TABLE review_program');
		await queryRunner.query('DROP TABLE review_product');
		await queryRunner.query('DROP TABLE discount');
		await queryRunner.query('DROP TABLE attendee');
		await queryRunner.query('DROP TABLE image');
		await queryRunner.query('DROP TABLE program_item');
		await queryRunner.query('DROP TABLE invoice');
		await queryRunner.query('DROP TABLE program');
		await queryRunner.query('DROP TABLE product');
		await queryRunner.query('DROP TABLE user');
	}
}
