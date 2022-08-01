
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';
import { ProductDomain } from './product.domain';

interface IImageProps {
  product?: ProductDomain;
  alt?: string;
  url?: string;

}

export class ImageDomain extends AggregateRoot<IImageProps> {
	get alt(): string {
		return this.props.alt;
	}

	set alt(alt: string) {
		this.props.alt = alt;
	}

	get url(): string {
		return this.props.url;
	}

	set url(url: string) {
		this.props.url = url;
	}

	get product(): ProductDomain {
		return this.props.product;
	}

	set product(product: ProductDomain) {
		this.props.product = product;
	}

	public static create(
		props: IImageProps,
		id?: UniqueEntityID,
	): Result<ImageDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<ImageDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const user = new ImageDomain(defaultValues, id);
		return Result.ok<ImageDomain>(user);
	}
}
