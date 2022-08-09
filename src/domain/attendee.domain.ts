import * as moment from 'moment';
import { join } from 'path';
import { toFile } from 'qrcode';

import { InvoiceDomain, ProgramDomain, UserDomain } from '.';
import { QR_FOLDER, STATIC_FOLDER } from '../common/constants/system';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';

interface IAttendeeProps {
	user?: UserDomain;
	program?: ProgramDomain;
	invoice?: InvoiceDomain;
	imageQR?: string;
	isCheckIn?: boolean;
}

const urlQR = join(__dirname, '..', '..', STATIC_FOLDER, QR_FOLDER);

export class AttendeeDomain extends AggregateRoot<IAttendeeProps> {
	get user(): UserDomain {
		return this.props.user;
	}

	set user(val: UserDomain) {
		this.props.user = val;
	}

	get program(): ProgramDomain {
		return this.props.program;
	}

	set program(val: ProgramDomain) {
		this.props.program = val;
	}

	get invoice(): InvoiceDomain {
		return this.props.invoice;
	}

	set invoice(val: InvoiceDomain) {
		this.props.invoice = val;
	}

	get imageQR(): string {
		return this.props.imageQR;
	}

	set imageQR(imageQR: string) {
		this.props.imageQR = imageQR;
	}

	get isCheckIn(): boolean {
		return this.props.isCheckIn;
	}

	checkIn() {
		this.props.isCheckIn = true;
	}

	async generateQRCode() {
		const now = moment().format('YYYYMMDD');
		const qrFilename = `${this.props.user.username}_attend_${this.props.program.id.toString()}_${now}.png`;
		const content = JSON.stringify({
			user: this.user.id.toValue(),
			program: this.program.id.toValue(),
			attendee: this.id.toValue(),
			name: this.program.name,
		});
		await toFile(join(urlQR, qrFilename), content, {
			width: 500,
			type: 'png',
		});
		this.props.imageQR = join(QR_FOLDER, qrFilename);
	}

	public static create(props: IAttendeeProps, id?: UniqueEntityID): Result<AttendeeDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<AttendeeDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new AttendeeDomain(defaultValues, id);
		return Result.ok<AttendeeDomain>(domain);
	}
}
