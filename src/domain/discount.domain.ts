import * as moment from 'moment';

import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProductDomain, ProgramDomain } from '.';

interface IDiscountProps {
	program?: ProgramDomain;
	code?: string;
	startDate?: Date;
	expiredDate?: Date;
	discount: number;
	description?: string;
	products?: ProductDomain[];
}

export class DiscountDomain extends AggregateRoot<IDiscountProps>{

	get program(): ProgramDomain {
		return this.props.program;

	}

	set program(val: ProgramDomain) {
		this.props.program = val;
	}

	get startDate(): Date {
		return this.props.startDate;

	}

	set startDate(val: Date) {
		this.props.startDate = val;
	}

	get expiredDate(): Date {
		return this.props.expiredDate;

	}

	set expiredDate(val: Date) {
		this.props.expiredDate = val;
	}

	get discount(): number {
		return this.props.discount;

	}

	set discount(val: number) {
		this.props.discount = val;
	}

	get description(): string {
		return this.props.description;

	}

	set description(val: string) {
		this.props.description = val;
	}

	get code(): string {
		return this.props.code;

	}

	set code(val: string) {
		this.props.code = val;
	}

	get products(): ProductDomain[] {
		return this.props.products;

	}

	set products(val: ProductDomain[]) {
		this.props.products = val;
	}

	changeStartDate(date: Date) {
		const rule = moment().add(7, 'h').add(1,'d').toDate();
		if (date > rule) {
			this.startDate = date;
		}
	}

	changeExpiredDate(date: Date) {
		const rule = moment().add(7, 'h').add(1, 'd').toDate();
		if (date > rule && date > this.startDate) {
			this.expiredDate = date;
		}
	}

	changeProduct(program: ProgramDomain) {
		if (this.canUpdateOrDelete) {
			if (program && program.id.toValue() !== this.program.id.toValue()) {
				this.program = program;
			}
		}
	}

	changeProgram(program: ProgramDomain) {
		if(this.canUpdateOrDelete()){
			if (program && program.id.toValue() !== this.program.id.toValue()) {
				this.program = program;
			}
		}
	}

	changeCode(code: string) {
		if(this.canUpdateOrDelete()){
			if (code && code !== this.code) {
				this.code = code;
			}
		}
	}

	changeDiscount(discount: number) {
		if(this.canUpdateOrDelete()){
			if (discount && discount !== this.discount) {
				this.discount = discount;
			}
		}
	}

	changeDescription(description: string) {
		if (description && description !== this.description) {
			this.description = description;
		}
	}

	validate(): boolean {
		if (this.startDate >= this.expiredDate) {
			return false;
		}

		return true;
	}

	canUpdateOrDelete(): boolean{
		const now = moment().add(7, 'h').toDate();
		if (now <= this.startDate) {
			return true;
		}

		return false;
	}

	canUse(): boolean{
		const now = moment().add(7, 'h').toDate();
		if (now >= this.startDate && now <= this.expiredDate) {
			return true;
		}

		return false;
	}

	public static create(
		props: IDiscountProps,
		id?: UniqueEntityID,
	): Result<DiscountDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<DiscountDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new DiscountDomain(defaultValues, id);
		return Result.ok<DiscountDomain>(domain);
	}
}

