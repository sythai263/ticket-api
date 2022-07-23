
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { DetailOrderDomain } from './detailOrder.domain';
import { ReviewProductDomain } from './reviewProduct.domain';

interface IProductProps {
  name?: string;
	total?: number;
	price?: number;
	avatar?: string;
	description?: string;
	remain?: number;
	reviews?: ReviewProductDomain[];
	detail?: DetailOrderDomain[];
	buyAmount?: number;

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

	get detail(): DetailOrderDomain[]{
		return this.props.detail;
	}

	set detail(detail: DetailOrderDomain[]) {
		this.props.detail = detail;
	}

	get remain(): number {
		const sum = this.detail.reduce((prev, curr) => prev + curr.amount, 0);
		return this.props.total - sum;
	}

	get buyAmount(): number{
		return this.props.buyAmount;
	}

	set buyAmount(buyAmount: number) {
		this.props.buyAmount = buyAmount;
	}

	get starAvg(): number {
		if (this.props.reviews.length > 0) {
			const sum = this.props.reviews.reduce((prev, curr) => prev + curr.star, 0);
			return sum / this.props.reviews.length;
		}

		return 5;

	}

	get reviews(): ReviewProductDomain[]{
		return this.props.reviews;
	}

	set reviews(reviews: ReviewProductDomain[]) {
		this.props.reviews = reviews;
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
