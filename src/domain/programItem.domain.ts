import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProductDomain, ProgramDomain } from '.';

interface IProductItemProps {
	program?: ProgramDomain;
	product?: ProductDomain;
}

export class ProductItemDomain extends AggregateRoot<IProductItemProps>{

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

	public static create(
		props: IProductItemProps,
		id?: UniqueEntityID,
	): Result<ProductItemDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<ProductItemDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new ProductItemDomain(defaultValues, id);
		return Result.ok<ProductItemDomain>(domain);
	}
}

