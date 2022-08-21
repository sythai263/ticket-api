import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class seedingData1655784020000 implements MigrationInterface {
	name = 'seedingData1655784020000';

	public async up(queryRunner: QueryRunner): Promise<void> {
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
		'Thái',
		'Lê Sỹ',
		'0984786432',
		'sythai263@gmail.com',
		'2000-03-26',
		'Male',
		'assets/upload/avatars/sy-thai.jpg',
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
		'Nguyễn Đức',
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
		'Lê Thị',
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
		'Hùng',
		'Trần Văn',
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
		'Móc khóa Đa phương tiện',
		100,
		15000,
		'Mua ngay móc khóa Đa phương tiện, giảm 10% khi đặt trước !',
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
		'Dây đeo Đa phương tiện',
		100,
		38000,
		'Mua ngay dây đeo Đa phương tiện, giảm 10% khi đặt trước !',
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
		'Bao đựng thẻ Đa phương tiện',
		100,
		30000,
		'Mua ngay bao đựng thẻ Đa phương tiện, giảm 10% khi đặt trước !',
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
		'Combo dây đeo và bao đựng thẻ',
		100,
		59000,
		'Mua ngay Combo dây đeo và bao đựng thẻ, giảm 10% khi đặt trước !',
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
		'Sổ tay Đa phương tiện',
		60,
		81000,
		'Mua ngay bao đựng thẻ Đa phương tiện, giảm 10% khi đặt trước !',
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
		'Sổ tay',
		60,
		59000,
		'Mua ngay Sổ tay',
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
		'Móc khóa',
		200,
		19000,
		'Mua ngay móc khóa',
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
		'WORKSHOP - CÔNG NGHỆ ĐA PHƯƠNG TIỆN: VẼ TAY - YES OR NO?',
		'2022-08-14 07:30:00',
		'2022-08-14 10:00:00',
		'Giảng đường 2A08 - Cơ sở đào tạo TP. Thủ Đức',
		100,
		0,
		'Với mục đích giúp định hướng cho các bạn sinh viên năm nhất và năm hai của ngành chọn được chuyên ngành phù hợp. Đồng thời là cũng là cơ hội để các bạn sĩ tử được giải đáp thắc mắc về ngành.\nBuổi workshop sẽ cho bạn thấy một góc nhìn mới, cụ thể và chân thực hơn về ngành và chuyên ngành. Giúp bạn có thể vạch ra con đường đúng đắn nhất.\n Khi tham gia workshop, các bạn sẽ được các diễn giả giải đáp tất cả những câu hỏi, trang bị thêm kiến thức để sẵn sàng cho một tương lai.',
		'assets/upload/programs/ve-tay-yes-or-no.jpg',
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
		'GIAO LƯU KHOA - De LOTTO 2022',
		'2022-09-17 11:30:00',
		'2022-09-17 14:00:00',
		'Khuôn viên Học viện - Cơ sở đào tạo TP. Thủ Đức',
		300,
		50000,
		'Chính thức lộ diện DE LOTTO - một sự kiện hấp dẫn đang chờ các học viên của Học Viện Hoàng Gia chúng ta khám phá.\nĐây là sự kiện giao lưu đầu tiên của Khoa Điện Tử và Đa Phương Tiện, đến với DE LOTTO mọi người sẽ có một trải nghiệm tuyệt vời với những nội dung vô cùng đặc sắc',
		'assets/upload/programs/de-lotto.jpg',
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
		'Giảm tới 20% cho các sản phẩm trong sự kiện Vẽ tay',
		1,
		1
	),
	(
		'DELOTTO',
		1,
		'2022-07-31 00:00:00',
		'2022-08-30 23:59:59',
		15,
		'Giảm tới 15% cho các sản phẩm trong sự kiện Vẽ tay',
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
		'Móc khóa đa phương tiện',
		1,
		1,
		1
	),
	(
		'assets/upload/products/day-deo-the.jpg',
		'Dây đeo Đa phương tiện',
		2,
		1,
		1
	),
	(
		'assets/upload/products/bao-dung-the.jpg',
		'Bao đựng thẻ Đa phương tiện',
		3,
		1,
		1
	),
	(
		'assets/upload/products/combo-day-bao.jpg',
		'Combo dây đeo và bao đựng thẻ',
		4,
		1,
		1
	),
	(
		'assets/upload/products/so-tay-2.jpg',
		'Sổ tay Đa phương tiện',
		5,
		1,
		1
	),
	(
		'assets/upload/products/so-tay.jpg',
		'Sổ tay',
		6,
		1,
		1
	),
	(
		'assets/upload/products/moc-khoa-2.jpg',
		'Móc khóa',
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
