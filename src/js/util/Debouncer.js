class Debouncer {
	constructor(callback, delay = 1000) {
		this.debounceCallback = callback;
		this.debounceDelay = delay;
		this.debounceTimeout = null;

		this.debounce(this.debounceCallback, this.debounceDelay);
	}

	debounce(callback, delay = this.debounceDelay) {
		clearTimeout(this.debounceTimeout); // Clear debounce timer if still typing.
		this.debounceTimeout = setTimeout(() => {
			callback();
		}, delay);
	}
}

export default Debouncer;
