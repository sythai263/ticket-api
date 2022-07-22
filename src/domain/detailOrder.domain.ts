
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { DiscountDomain, ProductDomain, PurchaseDomain } from '.';

interface IDetailOrderProps {
	purchase?: PurchaseDomain;
	product?: ProductDomain;
	discount?: DiscountDomain;
	amount?: number;
}

export class DetailOrderDomain extends AggregateRoot<IDetailOrderProps>{

	get purchase(): PurchaseDomain {
		return this.props.purchase;

	}

	set purchase(val: PurchaseDomain) {
		this.props.purchase = val;
	}

	get product(): ProductDomain {
		return this.props.product;

	}

	set product(val: ProductDomain) {
		this.props.product = val;
	}

	get discount(): DiscountDomain {
		return this.props.discount;

	}

	set discount(val: DiscountDomain) {
		this.props.discount = val;
	}

	get amount(): number {
		return this.props.amount;

	}

	set amount(val: number) {
		this.props.amount = val;
	}

	get total(): number{
		return this.summary - this.discountAmount;
	}

	get discountAmount(): number{
		let total = 0;
		if (this.discount) {
			total = this.product.price * this.amount * this.discount.discount/100;
		}

		return total;
	}

	get summary(): number{
		return this.product.price *this.amount;

	}

	public static create(
		props: IDetailOrderProps,
		id?: UniqueEntityID,
	): Result<DetailOrderDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<DetailOrderDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new DetailOrderDomain(defaultValues, id);
		return Result.ok<DetailOrderDomain>(domain);
	}
}

