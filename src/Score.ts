export class Score {
	_state = 0;

	element: HTMLElement;

	container: HTMLElement;

	constructor() {
		this.container = document.body;
		this.element = document.createElement('div');
		this.element.classList.add('score');

		this.updateText();
	}

	get state() {
		return this._state;
	}

	set state(value: number) {
		this._state = value;

		this.updateText();
	}

	increase(value: number) {
		this.state += value;
	}

	updateText() {
		this.element.innerText = `${this.state}`;
	}

	render() {
		this.container.appendChild(this.element);
	}
}
