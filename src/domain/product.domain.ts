import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';

interface IProductProps {
  name?: string;
	total?: number;
	price?: number;
	avatar?: string;
	description?: string;
	remain?: number;
}

export class ProductDomain extends AggregateRoot<IProductProps> {

	get name(): string{
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
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

	get description(): string{
		return this.props.description;
	}

	set description(description: string) {
		this.props.description = description;
	}

	get avatar(): string{
		return this.props.avatar;
	}

	set avatar(avatar: string) {
		this.props.avatar = avatar;
	}

	get remain(): number {
		return this.props.remain;
	}

	set remain(purchased: number) {
		if (this.props.total > purchased) {
			this.props.remain = this.props.total - purchased;
		}else {this.props.remain = 0;}

	}

	changeName(name: string) {
		if (!name && this.props.name !== name) {
			this.props.name = name;
		}
	}

	changePrice(price: number) {
		if (!price && this.props.price !== price) {
			this.props.price = price;
		}
	}

	changeTotal(total: number) {
		if (!total && this.props.total !== total) {
			this.props.total = total;
		}
	}

	changeDescription(description: string) {
		if (!description && this.props.description !== description) {
			this.props.description = description;
		}
	}

	changeAvatar(avatar: string) {
		if (!avatar && this.props.avatar !== avatar) {
			this.props.avatar = avatar;
		}
	}

	discount(percent: number): number{
		return this.props.price * (1-percent/100);
	}

	checkQuantity(purchased: number): boolean{
		return this.props.total > purchased;
	}

	public static create(
		props: IProductProps,
		id?: UniqueEntityID,
	): Result<ProductDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<ProductDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const product = new ProductDomain(defaultValues, id);
		return Result.ok<ProductDomain>(product);
	}
}
