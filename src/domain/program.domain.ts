import * as moment from 'moment';
import { join } from 'path';
import { toFile } from 'qrcode';

import { QR_FOLDER, STATIC_FOLDER } from '../common/constants/system';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { AttendeeDomain } from './attendee.domain';
import { ProductDomain } from './product.domain';
import { ProgramItemDomain } from './programItem.domain';
import { ReviewProgramDomain } from './reviewProgram.domain';

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
	attendees?: AttendeeDomain[];
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

	get attendees(): AttendeeDomain[] {
		return this.props.attendees;
	}

	set attendees(attendees: AttendeeDomain[]) {
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

	get amountRate(): number {
		return this.reviews.length;
	}

	get amountAttendee(): number {
		return this.attendees.length;
	}

	get amountCheckIn(): number {
		const count = this.attendees.reduce((sum, curr) => {
			if (curr.isCheckIn) {
				return sum + 1;
			}

			return sum;
		}, 0);

		return count;
	}

	get sumMoney(): number {
		const summary = this.attendees.reduce((sum, curr) => sum + curr.invoice.amount, 0);
		return summary;
	}

	get amountPaid(): number {
		const summary = this.attendees.reduce((sum, curr) => {
			if (curr.invoice.isPaid()) {
				return sum + curr.invoice.amount;
			}

			return sum;
		}, 0);

		return summary;
	}

	get allowCheckIn(): boolean {
		const now = moment().add(7, 'h').toDate();
		if (this.startDate < now) {
			return false;
		}

		return this.props.allowCheckIn;
	}

	isRegister(id?: number): boolean {
		if (!id) {
			return false;
		}

		const attendee = this.attendees.find((value) => value.user.id.toValue() === id);
		if (attendee) {
			return true;
		}

		return false;
	}

	checkCanUpdate(): boolean {
		const now = moment().add(7, 'h').toDate();
		if (this.startDate > now) {
			return false;
		}

		return true;
	}

	checkCanDelete(): boolean {
		if (this.reviews.length > 0) {
			return false;
		}

		if (this.attendees.length > 0) {
			return false;
		}

		const now = moment().add(7, 'h').toDate();
		if (this.startDate < now) {
			return false;
		}

		return true;
	}

	checkQuantity(quantity: number): boolean {
		if (!quantity) {
			return true;
		}

		if (this.amountAttendee > quantity) {
			return false;
		}

		return true;
	}

	changeStatusCheckIn(): boolean {
		const now = moment().add(7, 'h').toDate();
		if (this.endDate < now) {
			return false;
		}

		this.props.allowCheckIn = !this.props.allowCheckIn;
		return true;
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
		if (price && price !== this.props.price) {
			if (this.amountAttendee > 0) {
				return false;
			}

			this.props.price = price;
			return true;
		}

		return true;
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
