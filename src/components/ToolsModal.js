class ToolsModal {
	constructor(controller, container) {
		this.controller = controller;
		this.container = container;
		this.toggleButtons = document.querySelectorAll('[name="modal_toggle"]');

		// Init
		this.toggleButtons.forEach((button) => button.addEventListener('click', controller));
		this.container.addEventListener('click', controller);
		this.controller.addObserver(this);
	}

	update(data) {
		data.isModalVisible ? (this.container.style.visibility = 'visible') : (this.container.style.visibility = 'hidden');
	}
}

export default ToolsModal;
