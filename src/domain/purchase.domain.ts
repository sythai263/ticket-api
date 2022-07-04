import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { InvoiceDomain, UserDomain } from '.';

interface IPurchaseProps {
	user?: UserDomain;
	invoice?: InvoiceDomain;
	orderDate?: Date;
}

export class PurchaseDomain extends AggregateRoot<IPurchaseProps>{

	get user(): UserDomain {
		return this.props.user;

	}

	set user(val: UserDomain) {
		this.props.user = val;
	}

	get invoice(): InvoiceDomain {
		return this.props.invoice;

	}

	set invoice(val: InvoiceDomain) {
		this.props.invoice = val;
	}

	get orderDate(): Date {
		return this.props.orderDate;

	}

	set orderDate(val: Date) {
		this.props.orderDate = val;
	}

	public static create(
		props: IPurchaseProps,
		id?: UniqueEntityID,
	): Result<PurchaseDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<PurchaseDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new PurchaseDomain(defaultValues, id);
		return Result.ok<PurchaseDomain>(domain);
	}
}

