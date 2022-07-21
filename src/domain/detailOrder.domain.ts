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
		let total = this.amount * this.product.price;
		if (this.discount.discount) {
			total = total * (100-this.discount.discount)/100;
		}

		return total;
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

