import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProgramDomain, UserDomain } from '.';

interface IReviewProgramProps {
	user?: UserDomain;
	program?: ProgramDomain;
	comment?: string;
	star?: number;
}

export class ReviewProgramDomain extends AggregateRoot<IReviewProgramProps>{

	get user(): UserDomain {
		return this.props.user;

	}

	set user(val: UserDomain) {
		this.props.user = val;
	}

	get product(): ProgramDomain {
		return this.props.program;

	}

	set product(val: ProgramDomain) {
		this.props.program = val;
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
		props: IReviewProgramProps,
		id?: UniqueEntityID,
	): Result<ReviewProgramDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<ReviewProgramDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const domain = new ReviewProgramDomain(defaultValues, id);
		return Result.ok<ReviewProgramDomain>(domain);
	}
}

