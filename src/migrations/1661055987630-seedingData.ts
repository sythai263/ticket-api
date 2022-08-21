/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedingData1661055987630 implements MigrationInterface {
	name = 'seedingData1661055987630';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
INSERT INTO user (username, password, first_name, last_name, phone, email, birthday, gender, avatar, role, verify, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by) 
VALUES
('sythai', '$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO', 'Thái', 'Lê Sỹ', '0984786432', 'sythai263@gmail.com', '2000-03-26', 'Male', 'assets/upload/avatars/sy-thai.jpg', 'Admin', 1, '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, -1, -1, NULL),
('duynd', '$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO', 'Duy', 'Nguyễn Đức', '0984786436', 'duynd@gmail.com', '2000-03-26', 'Male', 'assets/upload/avatars/duy.jpg', 'User', 1, '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, -1, -1, NULL),
('tranglt', '$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO', 'Trang', 'Lê Thị', '09847864321', 'trang@gmail.com', '2000-03-21', 'Female', 'assets/upload/avatars/trang.jpg', 'User', 1, '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, -1, -1, NULL),
('hungtv', '$2a$12$qIQ0lEYMyhTmDeBTpDK3zekQmOzCi8Yg21L2AJ5dhCyVVieLgrvvO', 'Hùng', 'Trần Văn', '09847864329', 'hungtran@gmail.com', '2000-03-21', 'Male', 'assets/upload/avatars/hung.jpg', 'User', 0, '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, -1, -1, NULL);
`);
		// Password: admin123
		await queryRunner.query(`
INSERT INTO product (name, total, price, description, avatar, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by) 
VALUES
('Móc khóa Đa phương tiện', 100, 15000, 'Mua ngay móc khóa Đa phương tiện, giảm 10% khi đặt trước !', 'assets/upload/products/moc-khoa.jpg', '2022-07-15 02:07:45', '2022-07-15 02:07:45', NULL, 1, 1, NULL),
('Dây đeo Đa phương tiện', 100, 38000, 'Mua ngay dây đeo Đa phương tiện, giảm 10% khi đặt trước !', 'assets/upload/products/day-deo-the.jpg', '2022-07-15 02:11:32', '2022-07-15 02:11:32', NULL, 1, 1, NULL),
('Bao đựng thẻ Đa phương tiện', 100, 30000, 'Mua ngay bao đựng thẻ Đa phương tiện, giảm 10% khi đặt trước !', 'assets/upload/products/bao-dung-the.jpg', '2022-07-15 02:15:23', '2022-07-15 02:15:23', NULL, 1, 1, NULL),
('Combo dây đeo và bao đựng thẻ', 100, 59000, 'Mua ngay Combo dây đeo và bao đựng thẻ, giảm 10% khi đặt trước !', 'assets/upload/products/combo-day-bao.jpg', '2022-07-15 02:15:23', '2022-07-15 02:15:23', NULL, 1, 1, NULL),
('Sổ tay Đa phương tiện', 60, 81000, 'Mua ngay bao đựng thẻ Đa phương tiện, giảm 10% khi đặt trước !', 'assets/upload/products/so-tay-2.jpg', '2022-07-15 02:15:23', '2022-07-15 02:15:23', NULL, 1, 1, NULL),
('Sổ tay', 60, 59000, 'Mua ngay Sổ tay', 'assets/upload/products/so-tay.jpg', '2022-07-15 02:15:23', '2022-07-15 02:15:23', NULL, 1, 1, NULL),
('Móc khóa', 200, 19000, 'Mua ngay móc khóa', 'assets/upload/products/moc-khoa-2.jpg', '2022-07-15 02:15:23', '2022-07-15 02:15:23', NULL, 1, 1, NULL);

`);
		await queryRunner.query(`
INSERT INTO program (name, start_date, end_date, place, total, price, description, avatar, image_qr, allow_check_in, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by) VALUES
('WORKSHOP - CÔNG NGHỆ ĐA PHƯƠNG TIỆN: VẼ TAY - YES OR NO?', '2022-08-14 00:30:00', '2022-08-14 03:00:00', 'Giảng đường 2A08 - Cơ sở đào tạo TP. Thủ Đức', 100, 0, 'Với mục đích giúp định hướng cho các bạn sinh viên năm nhất và năm hai của ngành chọn được chuyên ngành phù hợp. Đồng thời là cũng là cơ hội để các bạn sĩ tử được giải đáp thắc mắc về ngành.\nBuổi workshop sẽ cho bạn thấy một góc nhìn mới, cụ thể và chân thực hơn về ngành và chuyên ngành. Giúp bạn có thể vạch ra con đường đúng đắn nhất.\n Khi tham gia workshop, các bạn sẽ được các diễn giả giải đáp tất cả những câu hỏi, trang bị thêm kiến thức để sẵn sàng cho một tương lai.', 'assets/upload/programs/ve-tay-yes-or-no.jpg', 'assets/qr/qrcode_program_1_20220715.png', 0, '2022-07-15 01:39:47', '2022-07-15 01:44:37', NULL, 1, 1, NULL),
('GIAO LƯU KHOA - De LOTTO 2022', '2022-09-17 04:30:00', '2022-09-17 07:00:00', 'Khuôn viên Học viện - Cơ sở đào tạo TP. Thủ Đức', 300, 50000, 'Chính thức lộ diện DE LOTTO - một sự kiện hấp dẫn đang chờ các học viên của Học Viện Hoàng Gia chúng ta khám phá.\nĐây là sự kiện giao lưu đầu tiên của Khoa Điện Tử và Đa Phương Tiện, đến với DE LOTTO mọi người sẽ có một trải nghiệm tuyệt vời với những nội dung vô cùng đặc sắc', 'assets/upload/programs/de-lotto.jpg', 'assets/qr/qrcode_program_2_20220715.png', 0, '2022-07-15 01:47:17', '2022-07-15 01:47:17', NULL, 1, 1, NULL),
('MULTI EXPO - TRIỂN LÃM ĐA PHƯƠNG TIỆN', '2022-09-24 18:00:20', '2022-09-25 03:30:20', 'Giảng đường 2A08 - Học viện cơ sở', 300, 0, 'MULTI EXPO 2022 là sự kiện triển lãm do Liên Chi Đoàn Công Nghệ Đa Phương Tiện thuộc Học viện Công Nghệ Bưu Chính Viễn Thông cơ sở Thành phố Hồ Chí Minh tổ chức, với sự tài trợ của ARENA MULTIMEDIA. Đây là triển lãm nghệ thuật dành cho tất cả những bạn sinh viên thuộc tất cả các ngành nghề của các trường đại học, cao đẳng, để tạo ra một chốn cho những người trẻ chung niềm đam mê nghệ thuật cùng nhau giao lưu, học hỏi và trao đổi kinh nghiệm trong lĩnh vực sáng tạo này.', 'assets/upload/programs/multi-expo_20220821_050604.png', 'assets/qr/qrcode_program_3_20220821.png', 0, '2022-08-21 05:06:58', '2022-08-21 05:06:58', NULL, 1, 1, NULL),
('Chuyến xe Trao trăng 2022', '2022-10-28 17:00:16', '2022-10-30 01:30:16', 'xã Hướng Thọ Phú, thành phố Tân An, tỉnh Long An', 100, 199000, 'Như các bạn đã biết, vào tháng 9 này sẽ diễn ra một sự kiện đánh dấu sự kết hợp của hai LCĐ Quản Trị Kinh Doanh và LCĐ Công Nghệ Đa Phương Tiện. Đó là chương trình thiện nguyện \"CHUYẾN XE TRAO TRĂNG\", chương trình ra đời với mong muốn mang lại một mùa trung thu ấm áp, trọn vẹn cho các em nhỏ\nVới tất cả tình yêu thương và tâm huyết đến từ BTC chương trình và các bạn TNV, bọn mình hy vọng mùa trung thu này sẽ là một kỷ niệm không thể nào quên được của mọi người \nChương trình\"CHUYẾN XE TRAO TRĂNG\" phối hợp với Đoàn xã Hướng Thọ Phú, thành phố Tân An, tỉnh Long An vào ngày ', 'assets/upload/programs/chuyen-xe-trao-trang-2019_20220821_051035.jpg', 'assets/qr/qrcode_program_4_20220821.png', 0, '2022-08-21 05:11:25', '2022-08-21 05:11:25', NULL, 1, 1, NULL),
('TRIỂN LÃM TRANH - PTIT YÊU THƯƠNG', '2022-11-19 18:00:46', '2022-11-20 01:30:46', 'Học viện cơ sở Q.1', 300, 0, 'Sau một thời gian được tuyển chọn kĩ lưỡng bởi BTC và các thầy cô thì các tác phẩm vào vòng trong sẽ được triển lãm nhân dịp Lễ tri ân ngày Nhà giáo VN 20/11 sắp tới nhé.\nBên cạnh những tác phẩm dự thi còn có những ấn phẩm siêu ấn tượng của các thế hệ Multimedia nhaaaaa.', 'assets/upload/programs/trien-lam-tranh_20220821_051658.png', 'assets/qr/qrcode_program_5_20220821.png', 0, '2022-08-21 05:18:38', '2022-08-21 05:18:38', NULL, 1, 1, NULL),
('Multi Christmas Party ', '2022-12-24 05:30:51', '2022-12-24 09:00:51', 'Hội trường D - Học viện cơ sở', 200, 39000, 'Hãy đi tới đúng giờ để tham gia được hết mọi hoạt động của buổi Party nhé.\nChuẩn bị xúng xính quần áo trang phục thật đẹp theo đúng dresscode ĐỎ - TRẮNG nè.\nCuối cùng và không kém phần quan trọng nhất: Hãy nhớ mang theo phần quà Giáng Sinh do chính tay bạn chuẩn bị để tham gia tiết mục Đổi quà nhe.\n\nMọi người ngày mai hãy nhớ đến Multi Christmas Party và chung vui cùng với bọn mình nhéeee ', 'assets/upload/programs/chrismas-party_20220821_052337.jpg', 'assets/qr/qrcode_program_6_20220821.png', 0, '2022-08-21 05:23:43', '2022-08-21 05:23:43', NULL, 1, 1, NULL),
('NHÂN PHẨM MÀU CAM', '2022-10-23 10:00:50', '2022-10-30 07:00:50', 'Online', 64, 30000, '[NHÂN PHẨM MÀU CAM]\nSàn Đấu Giải Trí Cho Tất Cả Sinh Viên LẦN ĐẦU XUẤT HIỆN TẠI HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG!!!\n\nLà cuộc thi đấu thông qua tựa game Liên Minh Huyền Thoại với chế độ chơi ĐẤU TRƯỜNG CHÂN LÝ do LCĐ Công nghệ Đa phương tiện tổ chức | Hứa hẹn sẽ mang đến cho các bạn trẻ một sân chơi độc đáo và đầy hấp dẫn trong dịp hè 2020.\nTổng giá trị giải thưởng lên đến 1.500.000 VNĐ', 'assets/upload/programs/nhan-pham-mau-cam_20220821_052649.jpg', 'assets/qr/qrcode_program_7_20220821.png', 0, '2022-08-21 05:26:55', '2022-08-21 05:26:55', NULL, 1, 1, NULL),
('Happy Birthday Multi', '2022-11-25 04:00:23', '2022-11-25 09:00:23', 'Hội trường D - Học viện cơ sở', 500, 0, 'CHÚC MỪNG SINH NHẬT MULTIMEDIA LẦN THỨ BẢY\nVậy là đêm sinh nhật lần thứ tư của Multimedia đã kết thúc \nCám ơn sự hiện diện của các anh chị khoá trước: D13 - D14 - D15 - D16 cùng với sự tham gia của các bạn sinh viên D17 - D18 - D19 - D20 đã cùng tới góp vui cho buổi sinh nhật ngày hôm ấy. Đồng thời cũng cảm ơn rất nhiều tới những lời chúc tốt đẹp của mọi người dành cho Multimedia những năm phía trước \nMột lần là sinh viên Multi, thì mãi mãi là thành viên của đại gia đình Multi \nHãy cùng nhau cố gắng thực hiện những điều mà chúng ta đã cùng nhau ước trong đêm hôm ấy nhé \nCảm ơn mọi người, vì đã yêu thương và đồng hành cùng Multi tới những giây phút này và cả thời gian phía trước nữa ', 'assets/upload/programs/happy-birth-day-multi_20220821_053152.jpg', 'assets/qr/qrcode_program_8_20220821.png', 0, '2022-08-21 05:42:58', '2022-08-21 05:42:58', NULL, 1, 1, NULL),
('Chuyến xe Trao Trăng 2023', '2023-03-25 17:00:17', '2023-03-26 02:00:17', 'Trung tâm dạy nghề người khuyết tật & mồ côi TP.HCM - Ấp 6, xã Xuân Thới Thượng, huyện Hóc Môn, TP.HCM.', 70, 99000, 'Chắc hẳn mọi người đang thắc mắc chuyến \"trao trăng\" năm nay giữa 2 LCĐ Công Nghệ Đa Phương Tiện và Quản Trị Kinh Doanh sẽ diễn ra ở đâu và khi nào, chúng mình xin phép công bố thời gian địa điểm rõ ràng để mọi người nắm nhé \nThời gian: 7h00 - 16h00 ngày 26/03/2023\nĐịa điểm: Trung tâm dạy nghề người khuyết tật & mồ côi TP.HCM - Ấp 6, xã Xuân Thới Thượng, huyện Hóc Môn, TP.HCM.\nChúng mình hãy cùng nhau tạo ra chuyến đi thật ấm áp và ý nghĩa cho các bạn có hoàn cảnh khó khăn vào dịp trung thu năm nay nhé, nhanh tay đăng kí form nào', 'assets/upload/programs/chuyen-xe-trao-trang-2020_20220821_054741.jpg', 'assets/qr/qrcode_program_9_20220821.png', 0, '2022-08-21 05:47:45', '2022-08-21 05:47:45', NULL, 1, 1, NULL),
('JOIN THE MULTI 2023', '2023-04-22 23:00:52', '2023-04-23 03:30:52', 'Giảng đường 2A08 - Học viện cơ sở', 120, 15000, 'Sau nhiều ngày vắng bóng thì hôm nay LCĐ CNĐPT đã quay lại với một bất ngờ dành cho các bạn Multimedia nói riêng và sinh viên học viện nói chung\n\nWorkshop, một sự kiện sắp được tổ chức tại học viện với mong muốn giúp các bạn sinh viên multimedia hiểu rõ hơn về ngành học và từ đó các bạn sẽ định hướng rõ ràng hơn về nghề nghiệp tương lai của chính mình', 'assets/upload/programs/join-the-multi-2020_20220821_055107.jpg', 'assets/qr/qrcode_program_10_20220821.png', 0, '2022-08-21 05:51:25', '2022-08-21 05:51:25', NULL, 1, 1, NULL),
('LETS TALK - NÓI ĐI CHỜ CHI', '2022-10-01 10:00:31', '2022-10-09 07:30:31', 'Online', 128, 15000, 'LET’STALK - NÓI ĐI CHỜ CHI\n--------------------\n\nChạy trạm online? Các bạn nghĩ sao?\nĐúng vậy, tháng 12 này, Nhà Multimedia sẽ mang đến Học viện một trò chơi lạ mà quen, một cuộc đua nảy lửa với 6 trạm 12 trò cực kỳ kịch tính và thú vị. Hứa hẹn sẽ mang đến những trải nghiệm chưa từng có.\n￼\nCòn chần chờ gì nữa mà không nhanh tay đăng ký để có cơ hội được tận mắt thấy, tận tai nghe những trò chơi mà nhà Multi dày công chuẩn bị trong suốt chặng đường vừa qua', 'assets/upload/programs/lets-talk_20220821_055350.png', 'assets/qr/qrcode_program_11_20220821.png', 0, '2022-08-21 05:53:55', '2022-08-21 05:53:55', NULL, 1, 1, NULL),
('Talk show “Ctrl Z” - Nhìn lại 2022', '2022-12-30 05:30:00', '2022-12-30 09:00:40', 'Online', 180, 0, 'Talk show “Ctrl Z” - Nhìn lại 2022 và kỷ niệm 07 năm thành lập LCĐ Công nghệ Đa phương tiện\n--------------------\nMột năm vừa qua đã xảy quá nhiều biến cố đối với chúng ta do đại dịch Covid 19. Nhưng ngoài những điều tiêu cực đó, năm 2021 này có lẽ cũng đã mang lại cho mình và cho bạn nhiều điều đáng nhớ. \nHãy cùng chúng mình nhìn lại một năm 2021 thật đặc biệt của LCĐ Công nghệ Đa phương tiện, đồng thời cũng là dịp gặp gỡ kỷ niệm 7 tuổi của LCĐ ', 'assets/upload/programs/talkshow-ctrl-z_20220821_055637.jpg', 'assets/qr/qrcode_program_12_20220821.png', 0, '2022-08-21 05:57:08', '2022-08-21 05:57:08', NULL, 1, 1, NULL),
('ROAD TO C!SV 2022', '2022-11-04 04:00:18', '2022-11-04 08:00:18', 'Trung tâm giáo dục Quốc phòng - An ninh - ĐHQG TP HCM', 1000, 29000, '[ROAD TO C!SV 2020]\n\nNgày 4/11/2020 này, chúng ta có một cuộc hẹn VÔ CÙNG QUAN TRỌNG  tại Trung tâm Giáo dục Quốc phòng - An ninh ĐHQG Tp.Hồ Chí Minh\n\nMột đêm sôi động dành riêng cho các bạn D20 sau những giờ học căng thẳng, giúp cho các bạn tân sinh viên có cơ hội giao lưu học hỏi, tăng tính gắn kết giữa các bạn sinh viên đang học tập tại khu Quân sự!\n\nMột đêm duy nhất: 18h ngày 4/11/2022\n\nNgoài ra, chương trình còn có những trò chơi vô cùng thú vị cùng với những phần quà vô cùng hấp dẫn :\"> Hãy cùng đón chờ và tham gia cùng bọn mình nha!', 'assets/upload/programs/road-to-csv-2020_20220821_060415.jpg', 'assets/qr/qrcode_program_13_20220821.png', 0, '2022-08-21 06:04:20', '2022-08-21 06:04:21', NULL, 1, 1, NULL),
('NẮNG TRONG EM', '2022-09-24 17:00:08', '2022-09-25 03:00:08', 'Làng Thiếu Nhi Thủ Đức', 150, 99000, 'Xin chào mọi người! Tụi mình là những thành viên của BTC chương trình Thiện Nguyện “NẮNG TRONG EM” đây.\n\nĐể chương trình được diễn ra thành công trọn vẹn nhất thì chắc chắn không thể thiếu được sự hỗ trợ từ các bạn tình nguyện viên năng nổ nhiệt huyết rồi đúng không nào?\n\nVì vậy, tụi mình chính thức mở đơn tìm Tình nguyện viên tham gia “NẮNG TRONG EM’ - Những chiến binh giàu lòng nhân ái, nhiệt thành, và trách nhiệm.', 'assets/upload/programs/nang-trong-em_20220821_060736.jpg', 'assets/qr/qrcode_program_14_20220821.png', 0, '2022-08-21 06:08:01', '2022-08-21 06:08:01', NULL, 1, 1, NULL);

		`);
		await queryRunner.query(`
INSERT INTO discount (code, program_id, start_date, expired_date, discount, description, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by) 
VALUES
('VETAY', 1, '2022-07-18 00:00:00', '2022-08-30 23:59:59', 20, 'Giảm tới 20% cho các sản phẩm trong sự kiện Vẽ tay', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL),
('DELOTTO', 1, '2022-07-31 00:00:00', '2022-08-30 23:59:59', 15, 'Giảm tới 15% cho các sản phẩm trong sự kiện Vẽ tay', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL);

		`);
		await queryRunner.query(`
INSERT INTO program_item ( program_id, product_id, created_by, updated_by) 
VALUES
	(1, 1, 1, 1),
	(1, 2, 1, 1),
	(2, 3, 1, 1),
	(2, 2, 1, 1);
`);

		await queryRunner.query(`
INSERT INTO image (product_id, alt, url, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by) VALUES
(1, 'Móc khóa đa phương tiện', 'assets/upload/products/moc-khoa.jpg', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL),
(2, 'Dây đeo Đa phương tiện', 'assets/upload/products/day-deo-the.jpg', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL),
(3, 'Bao đựng thẻ Đa phương tiện', 'assets/upload/products/bao-dung-the.jpg', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL),
(4, 'Combo dây đeo và bao đựng thẻ', 'assets/upload/products/combo-day-bao.jpg', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL),
(5, 'Sổ tay Đa phương tiện', 'assets/upload/products/so-tay-2.jpg', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL),
(6, 'Sổ tay', 'assets/upload/products/so-tay.jpg', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL),
(7, 'Móc khóa', 'assets/upload/products/moc-khoa-2.jpg', '2022-08-21 04:30:25', '2022-08-21 04:30:25', NULL, 1, 1, NULL);
`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DELETE FROM user WHERE id BETWEEN 1 AND 4;');
		await queryRunner.query('DELETE FROM image WHERE id BETWEEN 1 AND 7;');
		await queryRunner.query('DELETE FROM program_item WHERE id BETWEEN 1 AND 4;');
		await queryRunner.query('DELETE FROM discount WHERE id BETWEEN 1 AND 2;');
		await queryRunner.query('DELETE FROM program WHERE id BETWEEN 1 AND 14;');
		await queryRunner.query('DELETE FROM product WHERE id BETWEEN 1 AND 7;');
		await queryRunner.query('ALTER TABLE user AUTO_INCREMENT = 1;');
		await queryRunner.query('ALTER TABLE product AUTO_INCREMENT = 1;');
		await queryRunner.query('ALTER TABLE program AUTO_INCREMENT = 1;');
		await queryRunner.query('ALTER TABLE discount AUTO_INCREMENT = 1;');
		await queryRunner.query('ALTER TABLE program_item AUTO_INCREMENT = 1;');
		await queryRunner.query('ALTER TABLE image AUTO_INCREMENT = 1;');
	}
}
