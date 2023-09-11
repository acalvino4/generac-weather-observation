export class TooManyRequestsError extends Error {
	constructor() {
		super();
		this.message =
			'You have exceeded the api rate limit. Please try again later.';
		this.name = 'Too Many Requests Error';
	}
}
