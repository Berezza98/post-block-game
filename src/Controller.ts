export const KEYS = {
	SPACE: ' ',
	LEFT: 'ArrowLeft',
	RIGHT: 'ArrowRight',
} as const;

export class Controller {
	clicked = false;

	keysDown: Record<string, boolean> = {};

	constructor() {
		this.addListeners();
	}

	addListeners() {
		window.addEventListener('mousedown', this.mousedown.bind(this));
		window.addEventListener('mouseup', this.mouseup.bind(this));
		window.addEventListener('keydown', this.keydown.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
	}

	mousedown() {
		this.clicked = true;
	}

	mouseup() {
		this.clicked = false;
	}

	keydown(e: KeyboardEvent) {
		this.keysDown[e.key] = true;
	}

	keyup(e: KeyboardEvent) {
		this.keysDown[e.key] = false;
	}
}

export default new Controller();
