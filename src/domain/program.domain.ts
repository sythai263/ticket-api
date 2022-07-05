import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProductDomain } from './product.domain';

interface IProgramProps {
  name?: string;
	startDate?: Date;
	endDate?: Date;
	total?: number;
	price?: number;
	avatar?: string;
	description?: string;
	remain?: number;
	items?: ProductDomain[];
}

export class ProgramDomain extends AggregateRoot<IProgramProps> {

	get name(): string{
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
	}

	get startDate(): Date{
		return this.props.startDate;
	}

	set startDate(startDate: Date) {
		this.props.startDate = startDate;
	}

	get endDate(): Date{
		return this.props.endDate;
	}

	set endDate(endDate: Date) {
		this.props.endDate = endDate;
	}

	get total(): number{
		return this.props.total;

	}

	set total(total: number) {
		this.props.total = total;
	}

	get price(): number{
		return this.props.price;

	}

	set price(price: number) {
		this.props.price = price;
	}

	get avatar(): string{
		return this.props.avatar;
	}

	set avatar(avatar: string) {
		this.props.avatar = avatar;
	}

	get description(): string{
		return this.props.description;
	}

	set description(description: string) {
		this.props.description = description;
	}

	get remain(): number{
		return this.props.remain;
	}

	set remain(purchased: number) {
		if (this.props.total > purchased) {
			this.props.remain = this.props.total - purchased;
		}
		else {
			this.props.remain = 0;
		}
	}

	get items(): ProductDomain[]{
		return this.props.items;
	}

	set items(items: ProductDomain[]) {
		this.props.items = items;
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

	changePrice(price: number) {
		if (price && price !== this.props.price) {
			this.props.price = price;
		}
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

	public static create(
		props: IProgramProps,
		id?: UniqueEntityID,
	): Result<ProgramDomain> {
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
