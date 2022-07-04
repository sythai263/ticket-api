import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { InvoiceDomain, ProgramDomain, UserDomain } from '.';

interface IAttendeeProps {
  user?: UserDomain;
	program?: ProgramDomain;
	invoice?: InvoiceDomain;
}

export class AttendeeDomain extends AggregateRoot<IAttendeeProps>{
	get user(): UserDomain{
		return this.props.user;
	}

	set user(val: UserDomain) {
		this.props.user = val;
	}

	get program(): ProgramDomain{
		return this.props.program;
	}

	set program(val: ProgramDomain) {
		this.props.program = val;
	}

	get invoice(): InvoiceDomain{
		return this.props.invoice;
	}

	set invoice(val: InvoiceDomain) {
		this.props.invoice = val;
	}

	public static create(
		props: IAttendeeProps,
		id?: UniqueEntityID,
	): Result<AttendeeDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<AttendeeDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new AttendeeDomain(defaultValues, id);
		return Result.ok<AttendeeDomain>(domain);
	}
}
