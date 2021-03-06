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
	program_id int NULL,
	product_id int NULL,
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
	product_id int NULL,
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
	user_id int NULL,
	program_id int NULL,
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
	program_id int NULL,
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
	user_id int NULL,
	product_id int NULL,
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
	program_id int NULL,
	user_id int NULL,
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
		await queryRunner.query(
			`
INSERT INTO
	user (
		id,
		username,
		password,
		first_name,
		last_name,
		phone,
		email,
		birthday,
		gender,
		avatar,
		role,
		verify,
		created_by,
		updated_by
	)
VALUES
	(
		1,
		'sythai',
		'$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO',
		'Th??i',
		'L?? S???',
		'0984786432',
		'sythai263@gmail.com',
		'2000-03-26',
		'Male',
		'assets/upload/avatars/sythai.jpg',
		'Admin',
		1,
		-1,
		-1
	),
	(
		2,
		'duynd',
		'$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO',
		'Duy',
		'Nguy???n ?????c',
		'0984786436',
		'duynd@gmail.com',
		'2000-03-26',
		'Male',
		'assets/upload/avatars/duy.jpg',
		'user',
		1,
		-1,
		-1
	),
	(
		3,
		'tranglt',
		'$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO',
		'Trang',
		'L?? Th???',
		'09847864321',
		'trang@gmail.com',
		'2000-03-21',
		'Female',
		'assets/upload/avatars/trang.jpg',
		'user',
		1,
		-1,
		-1
	),
	(
		4,
		'hungtv',
		'$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO',
		'H??ng',
		'Tr???n V??n',
		'09847864329',
		'hungtran@gmail.com',
		'2000-03-21',
		'Male',
		'assets/upload/avatars/hung.jpg',
		'user',
		0,
		-1,
		-1
	);
`,
		);
		// Password: admin123
		await queryRunner.query(
			`
			INSERT INTO
	product (
		id,
		name,
		total,
		price,
		description,
		avatar,
		created_at,
		updated_at,
		deleted_at,
		created_by,
		updated_by,
		deleted_by
	)
VALUES
	(
		1,
		'M??c kh??a ??a ph????ng ti???n',
		100,
		15000,
		'Mua ngay m??c kh??a ??a ph????ng ti???n, gi???m 10% khi ?????t tr?????c !',
		'assets/upload/products/moc-khoa.jpg',
		'2022-07-15 09:07:45',
		'2022-07-15 09:07:45',
		NULL,
		1,
		1,
		NULL
	),
	(
		2,
		'D??y ??eo ??a ph????ng ti???n',
		100,
		38000,
		'Mua ngay d??y ??eo ??a ph????ng ti???n, gi???m 10% khi ?????t tr?????c !',
		'assets/upload/products/day-deo-the.jpg',
		'2022-07-15 09:11:32',
		'2022-07-15 09:11:32',
		NULL,
		1,
		1,
		NULL
	),
	(
		3,
		'Bao ?????ng th??? ??a ph????ng ti???n',
		100,
		30000,
		'Mua ngay bao ?????ng th??? ??a ph????ng ti???n, gi???m 10% khi ?????t tr?????c !',
		'assets/upload/products/bao-dung-the.jpg',
		'2022-07-15 09:15:23',
		'2022-07-15 09:15:23',
		NULL,
		1,
		1,
		NULL
	),
	(
		4,
		'Combo d??y ??eo v?? bao ?????ng th???',
		100,
		59000,
		'Mua ngay Combo d??y ??eo v?? bao ?????ng th???, gi???m 10% khi ?????t tr?????c !',
		'assets/upload/products/combo-day-bao.jpg',
		'2022-07-15 09:15:23',
		'2022-07-15 09:15:23',
		NULL,
		1,
		1,
		NULL
	),
	(
		5,
		'S??? tay ??a ph????ng ti???n',
		60,
		81000,
		'Mua ngay bao ?????ng th??? ??a ph????ng ti???n, gi???m 10% khi ?????t tr?????c !',
		'assets/upload/products/so-tay-2.jpg',
		'2022-07-15 09:15:23',
		'2022-07-15 09:15:23',
		NULL,
		1,
		1,
		NULL
	),
	(
		6,
		'S??? tay',
		60,
		59000,
		'Mua ngay S??? tay',
		'assets/upload/products/so-tay.jpg',
		'2022-07-15 09:15:23',
		'2022-07-15 09:15:23',
		NULL,
		1,
		1,
		NULL
	),
	(
		7,
		'M??c kh??a',
		200,
		19000,
		'Mua ngay m??c kh??a',
		'assets/upload/products/moc-khoa-2.jpg',
		'2022-07-15 09:15:23',
		'2022-07-15 09:15:23',
		NULL,
		1,
		1,
		NULL
	);

			`,
		);
		await queryRunner.query(`
		INSERT INTO
	program (
		id,
		name,
		start_date,
		end_date,
		place,
		total,
		price,
		description,
		avatar,
		image_qr,
		allow_check_in,
		created_at,
		updated_at,
		deleted_at,
		created_by,
		updated_by,
		deleted_by
	)
VALUES
	(
		1,
		'WORKSHOP - C??NG NGH??? ??A PH????NG TI???N: V??? TAY - YES OR NO?',
		'2022-08-14 07:30:00',
		'2022-08-14 10:00:00',
		'Gi???ng ???????ng 2A08 - C?? s??? ????o t???o TP. Th??? ?????c',
		100,
		0,
		'V???i m???c ????ch gi??p ?????nh h?????ng cho c??c b???n sinh vi??n n??m nh???t v?? n??m hai c???a ng??nh ch???n ???????c chuy??n ng??nh ph?? h???p. ?????ng th???i l?? c??ng l?? c?? h???i ????? c??c b???n s?? t??? ???????c gi???i ????p th???c m???c v??? ng??nh.\nBu???i workshop s??? cho b???n th???y m???t g??c nh??n m???i, c??? th??? v?? ch??n th???c h??n v??? ng??nh v?? chuy??n ng??nh. Gi??p b???n c?? th??? v???ch ra con ???????ng ????ng ?????n nh???t.\n Khi tham gia workshop, c??c b???n s??? ???????c c??c di???n gi??? gi???i ????p t???t c??? nh???ng c??u h???i, trang b??? th??m ki???n th???c ????? s???n s??ng cho m???t t????ng lai.',
		'assets/upload/images/ve-tay-yes-or-no.jpg',
		'assets/qr/qrcode_program_1_20220715.png',
		0,
		'2022-07-15 08:39:47',
		'2022-07-15 08:44:37',
		NULL,
		1,
		1,
		NULL
	),
	(
		2,
		'GIAO L??U KHOA - De LOTTO 2022',
		'2022-09-17 11:30:00',
		'2022-09-17 14:00:00',
		'Khu??n vi??n H???c vi???n - C?? s??? ????o t???o TP. Th??? ?????c',
		300,
		50000,
		'Ch??nh th???c l??? di???n DE LOTTO - m???t s??? ki???n h???p d???n ??ang ch??? c??c h???c vi??n c???a H???c Vi???n Ho??ng Gia ch??ng ta kh??m ph??.\n????y l?? s??? ki???n giao l??u ?????u ti??n c???a Khoa ??i???n T??? v?? ??a Ph????ng Ti???n, ?????n v???i DE LOTTO m???i ng?????i s??? c?? m???t tr???i nghi???m tuy???t v???i v???i nh???ng n???i dung v?? c??ng ?????c s???c',
		'assets/upload/images/de-lotto.jpg',
		'assets/qr/qrcode_program_2_20220715.png',
		0,
		'2022-07-15 08:47:17',
		'2022-07-15 08:47:17',
		NULL,
		1,
		1,
		NULL
	);
		`);
		await queryRunner.query(`
INSERT INTO
	discount (
		code,
		program_id,
		start_date,
		expired_date,
		discount,
		description,
		created_by,
		updated_by
	)
VALUES
	(
		'VETAY',
		1,
		'2022-07-18 00:00:00',
		'2022-08-30 23:59:59',
		20,
		'Gi???m t???i 20% cho c??c s???n ph???m trong s??? ki???n V??? tay',
		1,
		1
	),
	(
		'DELOTTO',
		1,
		'2022-07-31 00:00:00',
		'2022-08-30 23:59:59',
		15,
		'Gi???m t???i 15% cho c??c s???n ph???m trong s??? ki???n V??? tay',
		1,
		1
	);
		`);
		await queryRunner.query(`
INSERT INTO
	program_item (
		program_id,
		product_id,
		created_by,
		updated_by
	)
VALUES
	(1, 1, 1, 1),
	(1, 2, 1, 1),
	(2, 3, 1, 1),
	(2, 2, 1, 1);
		`);

		await queryRunner.query(`
		INSERT INTO
	image (
		url,
		alt,
		product_id,
		created_by,
		updated_by
	)
VALUES
	(
		'assets/upload/products/moc-khoa.jpg',
		'M??c kh??a ??a ph????ng ti???n',
		1,
		1,
		1
	),
	(
		'assets/upload/products/day-deo-the.jpg',
		'D??y ??eo ??a ph????ng ti???n',
		2,
		1,
		1
	),
	(
		'assets/upload/products/bao-dung-the.jpg',
		'Bao ?????ng th??? ??a ph????ng ti???n',
		3,
		1,
		1
	),
	(
		'assets/upload/products/combo-day-bao.jpg',
		'Combo d??y ??eo v?? bao ?????ng th???',
		4,
		1,
		1
	),
	(
		'assets/upload/products/so-tay-2.jpg',
		'S??? tay ??a ph????ng ti???n',
		5,
		1,
		1
	),
	(
		'assets/upload/products/so-tay.jpg',
		'S??? tay',
		6,
		1,
		1
	),
	(
		'assets/upload/products/moc-khoa-2.jpg',
		'M??c kh??a',
		7,
		1,
		1
	);
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
