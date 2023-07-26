interface JumpButtonProps {
	className: string;
	size: number;
}

export class JumpButton {
	private element = document.createElement('div');

	private _isPressed = false;

	private activeClassName = 'active';

	private hiddenClassName = 'hidden';

	private _visible = false;

	constructor({ className, size }: JumpButtonProps) {
		this.element.innerText = 'Jump';
		this.element.classList.add(className);
		this.element.style.height = this.element.style.width = `${size}px`;
		this.visible = false;

		this.addListeners();
	}

	get visible() {
		return this._visible;
	}

	set visible(value) {
		this.element.classList[value ? 'remove' : 'add'](this.hiddenClassName);
		this._visible = value;
	}

	get isPressed() {
		return this._isPressed;
	}

	set isPressed(value) {
		this.element.classList[value ? 'add' : 'remove'](this.activeClassName);

		this._isPressed = value;
	}

	private addListeners() {
		this.element.addEventListener('pointerdown', () => {
			this.isPressed = true;
		});

		this.element.addEventListener('pointerup', () => {
			this.isPressed = false;
		});
	}

	show() {
		this.visible = true;
	}

	append(parent: HTMLElement) {
		parent.appendChild(this.element);

		return this;
	}

	remove() {
		this.element.remove();
	}
}
