import { CurrencyCode } from '../common/constants/currencyCode';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';

interface IInvoiceProps {
	amount?: number;
	currencyCode?: CurrencyCode;
	bankCode?: string;
	bankTransNo?: string;
	cardType?: string;
	payDate?: Date;
	info?: string;
	status?: string;

}

export class InvoiceDomain extends AggregateRoot<IInvoiceProps>{
	get amount(): number {
	  return this.props.amount;
	}

	set amount(val: number) {
	  this.props.amount = val;
	}

	get currencyCode(): CurrencyCode {
	  return this.props.currencyCode;
	}

	set currencyCode(val: CurrencyCode) {
	  this.props.currencyCode = val;
	}

	get bankCode(): string {
	  return this.props.bankCode;
	}

	set bankCode(val: string) {
	  this.props.bankCode = val;
	}

	get bankTransNo(): string {
	  return this.props.bankTransNo;
	}

	set bankTransNo(val: string) {
	  this.props.bankTransNo = val;
	}

	get cardType(): string {
	  return this.props.cardType;
	}

	set cardType(val: string) {
	  this.props.cardType = val;
	}

	get payDate(): Date {
	  return this.props.payDate;
	}

	set payDate(val: Date) {
	  this.props.payDate = val;
	}

	get info(): string {
	  return this.props.info;
	}

	set info(val: string) {
	  this.props.info = val;
	}

	get status(): string {
	  return this.props.status;
	}

	set status(val: string) {
	  this.props.status = val;
	}

	public static create(
		props: IInvoiceProps,
		id?: UniqueEntityID,
	): Result<InvoiceDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<InvoiceDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new InvoiceDomain(defaultValues, id);
		return Result.ok<InvoiceDomain>(domain);
	}
}
