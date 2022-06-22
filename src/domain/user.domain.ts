import { Gender } from "../common/constants/gender";
import { RoleType } from "../common/constants/roleType";
import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

interface IUserProps {
	username?: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	email?: string;
	gender?: Gender;
	birthday?: Date;
	avatar?: string;
	role?: RoleType;
}
export class UserDomain extends AggregateRoot<IUserProps>{
	get username(): string{
		return this.props.username;
	}

	set username(username: string){
		this.props.username = username;
	}

	get lastName(): string{
		return this.props.lastName;
	}

	set lastName(lastName: string){
		this.props.lastName = lastName;
	}

	get firstName(): string{
		return this.props.firstName;
	}

	set firstName(firstName: string){
		this.props.firstName = firstName;
	}

	get phone(): string{
		return this.props.phone;
	}

	set phone(phone: string){
		this.props.phone = phone;
	}
	
	get email(): string{
		return this.props.email;
	}

	set email(email: string){
		this.props.email = email;
	}

	get gender(): Gender{
		return this.props.gender;
	}

	set gender(gender: Gender){
		this.props.gender = gender;
	}

	get birthday(): Date{
		return this.props.birthday;
	}

	set birthday(birthday: Date){
		this.props.birthday = birthday;
	}

	get avatar(): string{
		return this.props.avatar;
	}

	set avatar(avatar: string){
		this.props.avatar = avatar;
	}
	
	get role(): RoleType{
		return this.props.role;
	}

	set role(role: RoleType){
		this.props.role = role;
	}

}
