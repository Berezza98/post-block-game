export const KEYS = {
	SPACE: ' ',
} as const;

export class Controller {
	clicked = false;

	keysDown = {
		[KEYS.SPACE]: false,
	};

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
		if (this.keysDown.hasOwnProperty(e.key)) {
			this.keysDown[e.key] = true;
		}
	}

	keyup(e: KeyboardEvent) {
		if (this.keysDown.hasOwnProperty(e.key)) {
			this.keysDown[e.key] = false;
		}
	}
}

export default new Controller();