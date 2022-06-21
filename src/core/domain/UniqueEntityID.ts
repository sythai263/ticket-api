import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<number> {
	constructor(id?: number) {
		super(id || 0);
	}
}
