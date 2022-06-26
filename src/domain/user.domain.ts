import * as bcrypt from 'bcrypt';

import { Gender } from '../common/constants/gender';
import { RoleType } from '../common/constants/roleType';
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from '../core/logic/Guard';
import { Result } from '../core/logic/Result';

interface IUserProps {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  gender?: Gender;
  birthday?: Date;
  avatar?: string;
	role?: RoleType;
	verify?: boolean;
}
const salt = 12;
export class UserDomain extends AggregateRoot<IUserProps> {
	get username(): string {
		return this.props.username;
	}

	set username(username: string) {
		this.props.username = username;
	}

	get lastName(): string {
		return this.props.lastName;
	}

	set lastName(lastName: string) {
		this.props.lastName = lastName;
	}

	get firstName(): string {
		return this.props.firstName;
	}

	set firstName(firstName: string) {
		this.props.firstName = firstName;
	}

	get phone(): string {
		return this.props.phone;
	}

	set phone(phone: string) {
		this.props.phone = phone;
	}

	get email(): string {
		return this.props.email;
	}

	set email(email: string) {
		this.props.email = email;
	}

	get gender(): Gender {
		return this.props.gender;
	}

	set gender(gender: Gender) {
		this.props.gender = gender;
	}

	get birthday(): Date {
		return this.props.birthday;
	}

	set birthday(birthday: Date) {
		this.props.birthday = birthday;
	}

	get avatar(): string {
		return this.props.avatar;
	}

	set avatar(avatar: string) {
		this.props.avatar = avatar;
	}

	get role(): RoleType {
		return this.props.role;
	}

	set role(role: RoleType) {
		this.props.role = role;
	}

	get password() {
		return this.props.password;
	}

	set password(password: string) {
		this.props.password = password;
	}

	get verify(): boolean{
		return this.verify;
	}

	set verify(verify: boolean) {
		this.verify = verify;
	}

	isAdmin = () => this.role === RoleType.ADMIN;

	isUser = () => this.role === RoleType.USER;

	checkPassword(password: string) {
		return bcrypt.compareSync(password, this.props.password);
	}

	changeBirthday(birthday: Date) {
		if (birthday && birthday !== this.birthday) {
			this.birthday = birthday;
		}
	}

	changeLastName(lastName: string) {
		if (lastName && lastName !== this.lastName) {
			this.lastName= lastName;
		}
	}

	changeGender(gender: Gender) {
		if (gender && gender !== this.gender) {
			this.gender= gender;
		}
	}

	changeFirstName(firstName: string) {
		if (firstName && firstName !== this.firstName) {
			this.firstName= firstName;
		}
	}

	changePhone(phone: string) {
		if (phone && phone !== this.phone) {
			this.phone= phone;
		}
	}

	changeEmail(email: string) {
		if (email && email !== this.email) {
			this.email= email;
		}
	}

	changePassword(oldPassword: string, password: string, rePassword: string): number {
		if (password) {
			if (!bcrypt.compareSync(oldPassword, this.password)) {
				return 1;
			}

			if (password !== rePassword) {
				return 2;
			}

			this.password = bcrypt.hashSync(password, salt);
			return 0;
		}

		return -1;
	}

	confirmPassword(rePassword: string): boolean{
		return this.password === rePassword;
	}

	hashPassword(password: string) {
		this.props.password = bcrypt.hashSync(password, salt);
	}

	public static create(
		props: IUserProps,
		id?: UniqueEntityID,
	): Result<UserDomain> {
		const propsResult = Guard.againstNullOrUndefinedBulk([]);
		if (!propsResult.succeeded) {
			return Result.fail<UserDomain>(propsResult.message);
		}

		const defaultValues = {
			...props,
		};
		const user = new UserDomain(defaultValues, id);
		return Result.ok<UserDomain>(user);
	}
}
