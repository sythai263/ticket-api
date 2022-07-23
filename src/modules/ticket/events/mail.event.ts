export class MailEvent{
	password: string;
	email: string;
	constructor(
		password: string,
		email: string
	) {
		this.email = email;
		this.password = password;
	}
}

