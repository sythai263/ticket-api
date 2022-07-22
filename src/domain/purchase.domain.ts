import { StatusBuy } from '../common/constants/statusBuy';
import { StatusInvoice } from '../common/constants/statusReceipt';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import {
	DetailOrderDomain,
	DiscountDomain,
	InvoiceDomain,
	ProductDomain,
	UserDomain
} from '.';

interface IPurchaseProps {
	user?: UserDomain;
	details?: DetailOrderDomain[];
	invoice?: InvoiceDomain;
	orderDate?: Date;
	status?: StatusBuy;
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

	get details(): DetailOrderDomain[]{
		return this.props.details;
	}

	set details(details: DetailOrderDomain[]){
		this.props.details = details;
	}

	get summary(): number {
		const sum = this.details.reduce((prev, curr) => prev + curr.summary, 0);
		return sum;
	}

	get status(): StatusBuy{
		return this.props.status;
	}

	set status(status: StatusBuy) {
		this.props.status = status;
	}

	changeStatus() {
		switch (this.status) {
		case StatusBuy.ORDERED:
			this.status = StatusBuy.CONFIRM;
			break;
		case StatusBuy.CONFIRM:
			this.status = StatusBuy.PREPARING;
			break;
		case StatusBuy.PREPARING:
			this.status = StatusBuy.SHIPPING;
			break;
		case StatusBuy.SHIPPING:
			this.status = StatusBuy.DELIVERED;
			break;
		default:
			this.status = StatusBuy.DELIVERED;

		}
	}

	changeStatusToReCeived() {
		if (this.status === StatusBuy.DELIVERED) {
			this.status = StatusBuy.RECEIVED;
		}
	}

	get discountAmount(): number {
		const sum = this.details.reduce((prev, curr) => prev + curr.discountAmount, 0);
		return sum;
	}

	createDetails(buyProduct: ProductDomain[], discount: DiscountDomain,) {
		if (discount) {
			const details = buyProduct.map(product => {
				const checkDiscount = discount.products.find(dis=> dis.id.toValue() === product.id.toValue());
				const detail = new DetailOrderDomain({
					product,
					amount: product.buyAmount,
					discount: null,
					purchase: null,
				});
				if (checkDiscount) {
					detail.discount = discount;
				}

				return detail;
			});
			this.props.details = details;
		} else {
			const details = buyProduct.map(product => {
				const detail = new DetailOrderDomain({
					product,
					amount: product.buyAmount,
					discount: null,
					purchase: null,
				});
				return detail;
			});
			this.props.details = details;
		}

	}

	createInvoice(){
		const sum = this.details.reduce((prev, curr) => prev + curr.total, 0);
		const invoice = new InvoiceDomain({
			amount: sum,
			info: 'Thanh toan don hang ',
			status: StatusInvoice.PENDING
		});
		this.props.invoice = invoice;
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

