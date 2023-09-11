export class ResponseFormatError extends Error {
	constructor() {
		super();
		this.message =
			'Badly formatted data returned by 3rd party API. Contact the site developer if issue persists';
		this.name = 'Response Format Error';
	}
}
