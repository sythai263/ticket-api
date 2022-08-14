import * as moment from 'moment';
import { join } from 'path';
import { toFile } from 'qrcode';

import { QR_FOLDER, STATIC_FOLDER } from '../common/constants/system';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProductDomain } from './product.domain';
import { ProgramItemDomain } from './programItem.domain';
import { ReviewProgramDomain } from './reviewProgram.domain';
import { UserDomain } from './user.domain';

const urlQR = join(__dirname, '..', '..', STATIC_FOLDER, QR_FOLDER);

interface IProgramProps {
	name?: string;
	startDate?: Date;
	endDate?: Date;
	total?: number;
	price?: number;
	avatar?: string;
	place?: string;
	imageQR?: string;
	description?: string;
	allowCheckIn?: boolean;
	items?: ProgramItemDomain[];
	attendees?: UserDomain[];
	products?: ProductDomain[];
	reviews?: ReviewProgramDomain[];
}

export class ProgramDomain extends AggregateRoot<IProgramProps> {
	get name(): string {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
	}

	get startDate(): Date {
		return this.props.startDate;
	}

	set startDate(startDate: Date) {
		this.props.startDate = startDate;
	}

	get endDate(): Date {
		return this.props.endDate;
	}

	set endDate(endDate: Date) {
		this.props.endDate = endDate;
	}

	get total(): number {
		return this.props.total;
	}

	set total(total: number) {
		this.props.total = total;
	}

	get price(): number {
		return this.props.price;
	}

	set price(price: number) {
		this.props.price = price;
	}

	get avatar(): string {
		return this.props.avatar;
	}

	set avatar(avatar: string) {
		this.props.avatar = avatar;
	}

	get place(): string {
		return this.props.place;
	}

	set place(place: string) {
		this.props.place = place;
	}

	get imageQR(): string {
		return this.props.imageQR;
	}

	set imageQR(imageQR: string) {
		this.props.imageQR = imageQR;
	}

	get description(): string {
		return this.props.description;
	}

	set description(description: string) {
		this.props.description = description;
	}

	get remain(): number {
		return this.props.total - this.props.attendees.length;
	}

	get items(): ProgramItemDomain[] {
		return this.props.items;
	}

	set items(items: ProgramItemDomain[]) {
		this.props.items = items;
	}

	get attendees(): UserDomain[] {
		return this.props.attendees;
	}

	set attendees(attendees: UserDomain[]) {
		this.props.attendees = attendees;
	}

	get products(): ProductDomain[] {
		return this.props.products;
	}

	set products(products: ProductDomain[]) {
		this.props.products = products;
	}

	get reviews(): ReviewProgramDomain[] {
		return this.props.reviews;
	}

	set reviews(reviews: ReviewProgramDomain[]) {
		this.props.reviews = reviews;
	}

	get amountAttendee(): number {
		return this.attendees.length;
	}

	get allowCheckIn(): boolean {
		return this.props.allowCheckIn;
	}

	checkCanUpdate(): boolean {
		if (this.startDate > moment().add(7, 'h').toDate()) {
			return false;
		}
	}

	checkQuantity(quantity: number): boolean {
		if (this.amountAttendee > quantity) {
			return false;
		}
	}

	changeStatusCheckIn() {
		this.props.allowCheckIn = !this.props.allowCheckIn;
	}

	changeName(name: string) {
		if (name && name !== this.props.name) {
			this.props.name = name;
		}
	}

	changeAvatar(avatar: string) {
		if (avatar && avatar !== this.props.avatar) {
			this.props.avatar = avatar;
		}
	}

	changeAmount(amount: number) {
		if (amount && amount !== this.props.total) {
			this.props.total = amount;
		}
	}

	changePrice(price: number): boolean {
		if (this.amountAttendee > 0) {
			return false;
		}

		if (price && price !== this.props.price) {
			this.props.price = price;
			return true;
		}

		return false;
	}

	changeDescription(description: string) {
		if (description && description !== this.props.description) {
			this.props.description = description;
		}
	}

	changeStartDate(startDate: Date) {
		if (startDate && startDate !== this.props.startDate) {
			this.props.startDate = startDate;
		}
	}

	changeEndDate(endDate: Date) {
		if (endDate && endDate !== this.props.endDate) {
			this.props.endDate = endDate;
		}
	}

	isFree(): boolean {
		return this.props.price === 0;
	}

	canRegister(): boolean {
		const now = new Date();
		if (now > this.props.startDate || this.remain <= 0) {
			return false;
		}

		return true;
	}

	get starAvg(): number {
		if (this.props.reviews.length > 0) {
			const sum = this.props.reviews.reduce((prev, curr) => prev + curr.star, 0);
			return sum / this.props.reviews.length;
		}

		return 5;
	}

	async generateQRCode() {
		const now = moment().format('YYYYMMDD');
		const qrFilename = `qrcode_program_${this.id.toValue()}_${now}.png`;
		const content = JSON.stringify({
			program: this.id.toValue(),
			name: this.name,
		});
		await toFile(join(urlQR, qrFilename), content, {
			width: 500,
			type: 'png',
		});
		this.props.imageQR = join(QR_FOLDER, qrFilename);
	}

	public static create(props: IProgramProps, id?: UniqueEntityID): Result<ProgramDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<ProgramDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const program = new ProgramDomain(defaultValues, id);
		return Result.ok<ProgramDomain>(program);
	}
}
