import Debouncer from '../util/Debouncer';

class Results {
	constructor(controller, container) {
		this.controller = controller;
		this.container = container;
		this.debouncer = new Debouncer(this);

		// Init
		this.controller.addObserver(this);
	}

	createResult(result, index) {
		const resultContainer = document.createElement('div');
		resultContainer.setAttribute('data-index', index); // TODO: Use to delete content later.
		resultContainer.className = 'result';

		const resultLink = document.createElement('a');
		resultLink.setAttribute('href', result.url);
		resultLink.innerText = result.title;
		resultContainer.appendChild(resultLink);

		const resultURL = document.createElement('p');
		resultURL.innerText = result.url;
		resultContainer.appendChild(resultURL);

		const resultInfo = document.createElement('p');
		resultInfo.innerText = result.tags ? result.tags.join(', ') : '';
		resultContainer.appendChild(resultInfo);

		return this.container.appendChild(resultContainer);
	}

	nothingFound() {
		const resultContainer = document.createElement('p');
		resultContainer.innerText = 'Nothing found :(';
		return this.container.appendChild(resultContainer);
	}

	update(data) {
		this.container.classList.add('loading');
		this.debouncer.debounce(() => {
			// Clear, then filter resources with the search string, display a new result for each.
			this.container.classList.remove('loading');
			this.container.innerHTML = '';
			const filteredResources = this.controller.getFilteredResources(data.searchString);
			if (filteredResources.length >= 1) {
				filteredResources.forEach((result) => this.createResult(result, data.resources.indexOf(result)));
			} else {
				this.nothingFound();
			}
		});
	}
}

export default Results;
