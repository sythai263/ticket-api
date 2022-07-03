import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProductDomain, UserDomain } from '.';

interface IReviewProductProps {
	user?: UserDomain;
	product?: ProductDomain;
	comment?: string;
	star?: number;
}

export class ReviewProductDomain extends AggregateRoot<IReviewProductProps>{

	get user(): UserDomain {
		return this.props.user;

	}

	set user(val: UserDomain) {
		this.props.user = val;
	}

	get product(): ProductDomain {
		return this.props.product;

	}

	set product(val: ProductDomain) {
		this.props.product = val;
	}

	get comment(): string {
		return this.props.comment;

	}

	set comment(val: string) {
		this.props.comment = val;
	}

	get star(): number {
		return this.props.star;

	}

	set star(val: number) {
		this.props.star = val;
	}

	public static create(
		props: IReviewProductProps,
		id?: UniqueEntityID,
	): Result<ReviewProductDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<ReviewProductDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new ReviewProductDomain(defaultValues, id);
		return Result.ok<ReviewProductDomain>(domain);
	}
}

