import Debouncer from '../util/Debouncer';

class SearchBox {
	constructor(controller, input) {
		this.controller = controller;
		this.input = input;
		this.debouncer = new Debouncer(this);
		this.clearButton = document.querySelector(`[name="search_clear"]`);

		// Init
		this.clearButton.addEventListener('click', controller);
		this.controller.addObserver(this);
		this.input.addEventListener('input', controller);
	}

	update(data) {
		// Update the input box if it comes programmatically or from the user.
		if (this.input.value != data.searchString) this.input.value = data.searchString;

		// Pseudo load icon, later to be replaced with actual database loading.
		this.input.classList.add('loading');
		this.debouncer.debounce(() => this.input.classList.remove('loading'));
	}
}

export default SearchBox;
