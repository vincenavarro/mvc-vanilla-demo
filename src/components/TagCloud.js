class TagCloud {
	constructor(controller, container) {
		this.controller = controller;
		this.container = container;

		// Init
		this.controller.addObserver(this);
	}

	createTag(tag) {
		const element = document.createElement('button');
		element.innerText = tag;
		element.className = 'tag';
		element.name = 'tag';
		element.addEventListener('click', this.controller);
		return this.container.appendChild(element);
	}

	update(data) {
		// Clear tag cloud and show any tags that haven't been used in the search yet.
		this.container.innerHTML = '';
		const inactiveTags = data.tags.filter((tag) => !data.activeTags.includes(tag));
		inactiveTags.forEach((tag) => this.createTag(tag));
	}
}

export default TagCloud;
