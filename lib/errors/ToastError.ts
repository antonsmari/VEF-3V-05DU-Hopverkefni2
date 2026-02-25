export class ToastError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ToastError";
	}
}
