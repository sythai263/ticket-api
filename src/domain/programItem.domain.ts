import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProductDomain, ProgramDomain } from '.';

interface IProgramItemProps {
	program?: ProgramDomain;
	product?: ProductDomain;
}

export class ProgramItemDomain extends AggregateRoot<IProgramItemProps>{

	get program(): ProgramDomain {
		return this.props.program;

	}

	set program(val: ProgramDomain) {
		this.props.program = val;
	}

	get product(): ProductDomain {
		return this.props.product;

	}

	set product(val: ProductDomain) {
		this.props.product = val;
	}

	checkDuplicate(item: ProgramItemDomain): boolean{
		if (item.props.product.id.toValue() === this.props.product.id.toValue()
			&& item.props.program.id.toValue() === this.props.program.id.toValue()) {
			return true;
		}

		return false;
	}

	public static create(
		props: IProgramItemProps,
		id?: UniqueEntityID,
	): Result<ProgramItemDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<ProgramItemDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new ProgramItemDomain(defaultValues, id);
		return Result.ok<ProgramItemDomain>(domain);
	}
}

