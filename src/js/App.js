'use strict';

import SearchBox from './components/SearchBox';
import TagCloud from './components/TagCloud';
import Results from './components/Results';
import ToolsModal from './components/ToolsModal';
import DB from '../json/links.json';
import '../styles/styles.sass';

class View {
	constructor(controller) {
		this.controller = controller;

		const search = document.querySelector('.search');
		const modal = document.querySelector('.modal');
		const cloud = document.querySelector('.cloud');
		const results = document.querySelector('.results');

		// Init
		new SearchBox(controller, search);
		new ToolsModal(controller, modal);
		new TagCloud(controller, cloud);
		new Results(controller, results);

		// Announce view is loaded.
		const viewInit = new Event('viewInit');
		search.addEventListener('viewInit', controller);
		search.dispatchEvent(viewInit);
	}
}

class Model {
	constructor() {
		this._resources = DB;
		this.observers = [];
		this._searchString = '';
		this._activeTags = [];
		this._isModalVisible = false;
	}

	// Getters and Setters
	get activeTags() {
		return this._activeTags;
	}

	set activeTags(tags) {
		switch (typeof tags) {
			case 'string':
				return (this._activeTags = this.stringToTags(tags));
			case 'array':
				return (this._activeTags = tags);
			default:
				throw 'activeTags must be set with string or array.';
		}
	}

	get isModalVisible() {
		return this._isModalVisible;
	}

	set isModalVisible(value) {
		this._isModalVisible = value;
		return this.notifyObservers();
	}

	get resources() {
		// Returns alphabetically.
		return this._resources.sort((a, b) => a.title.localeCompare(b.title, 'en', { ignorePunctuation: true }));
	}

	get searchString() {
		return this._searchString;
	}

	set searchString(string) {
		this._searchString = string.trimStart();
		this.activeTags = this._searchString;
		return this.notifyObservers();
	}

	get tags() {
		// Get all possible tag from available resources.
		const allTags = [].concat(...this.resources.map((resource) => resource.tags));
		return this.cleanArray(allTags);
	}

	// Utility
	addObserver(observer) {
		this.observers.push(observer);
	}

	addResource({ title, url, tags }) {
		this.resources.push({ title: title, url: url, tags: this.stringToTags(tags) });
	}

	notifyObservers() {
		// console.info(`Notified: `,this);
		this.observers.forEach((observer) => observer.update(this));
	}

	cleanString(string) {
		// Remove extra spaces, numbers, and special characters
		return (
			string
				//.replace(/[\"\'~`!@#$%^&()_={}[\]:;,.<>+\/?-]+|\d+|^\s+$/g, '')
				.replace(/[^\w\s!?]/g, '')
				.replace(/\s+/gi, ' ')
				.trim()
		);
	}

	cleanArray(array) {
		// Deduplicates, sorts, and removes null/blank entries.
		return Array.from(new Set(array))
			.sort()
			.filter((item) => item);
	}

	stringToTags(tags) {
		return this.cleanArray(this.cleanString(tags).split(' '));
	}
}

class Controller {
	constructor(model) {
		this.model = model;
		this.debounceTimeout = null;
		this.debounceDelay = 1000;
	}

	handleEvent(event) {
		event.stopPropagation();
		if (event.target.name != 'search') event.preventDefault();

		switch (event.target.name) {
			case 'search':
				// Keep searchString in sync with the search box.
				return (this.model.searchString = event.target.value ? event.target.value : '');
			case 'search_clear':
				return (this.model.searchString = '');
			case 'tag':
				return (this.model.searchString += ' ' + event.target.innerText);
			case 'modal_submit':
				// Get any and all form resources and submit to Model as an object.
				const inputs = event.target.form.querySelectorAll('input');
				const newResource = {};
				[...inputs].forEach((input) => {
					if (!input.value) throw `${input.name} invalid.`;
					newResource[input.name] = input.value;
					input.value = '';
				});
				return this.model.addResource(newResource);
			case 'modal_export':
				// Exports JSON to new window.
				const exportWindow = window.open('', 'JSON Export');
				return (exportWindow.document.body.innerHTML = JSON.stringify(this.model.resources));
			case 'modal_toggle':
				return this.toggleModal(event);
		}

		if (event.target.classList.contains('modal')) {
			return this.toggleModal(event);
		}
	}

	addObserver(observer) {
		return this.model.addObserver(observer);
	}

	getFilteredResources() {
		const activeTags = this.model.activeTags;

		if (activeTags.length < 0) return this.model.resources; // If no search string, show all.

		return this.model.resources // For each resource...
			.filter((resource) =>
				activeTags // filter it with active tags.
					.every((activeTag) =>
						resource.tags // Every active tag must match...
							.some((tag) => activeTag == tag)
					)
			); // at least some of the resource tags.
	}

	toggleModal() {
		this.model.isModalVisible = !this.model.isModalVisible;
	}
}

const init = () => {
	const performanceTimerInit = performance.now();
	const model = new Model();
	const controller = new Controller(model);
	const view = new View(controller);
	console.info('Resource Search loaded in ' + (performance.now() - performanceTimerInit) + ' milliseconds.');
};

document.addEventListener('DOMContentLoaded', init);
