interface JumpButtonProps {
	className: string;
	size: number;
}

export class JumpButton {
	private element = document.createElement('div');

	private _isPressed = false;

	private activeClassName = 'active';

	constructor({ className, size }: JumpButtonProps) {
		this.element.innerText = 'Jump';
		this.element.classList.add(className);
		this.element.style.height = this.element.style.width = `${size}px`;

		this.addListeners();
	}

	get isPressed() {
		return this._isPressed;
	}

	set isPressed(value) {
		this.element.classList[value ? 'add' : 'remove'](this.activeClassName);

		this._isPressed = value;
	}

	addListeners() {
		this.element.addEventListener('pointerdown', () => {
			this.isPressed = true;
		});

		this.element.addEventListener('pointerup', () => {
			this.isPressed = false;
		});
	}

	append(parent: HTMLElement) {
		parent.appendChild(this.element);

		return this;
	}

	remove() {
		this.element.remove();
	}
}
