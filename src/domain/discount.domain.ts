import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProgramDomain } from '.';

interface IDiscountProps {
	program?: ProgramDomain;
	startDate?: Date;
	expiredDate?: Date;
	discount: number;
	description?: string;
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

