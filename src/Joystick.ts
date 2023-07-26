import { Vector2 } from 'three';

interface JoystickProps {
	className: string;
	size: number;
	removeLastValue: boolean;
}

export class Joystick {
	private canvas: HTMLCanvasElement;

	private ctx: CanvasRenderingContext2D;

	private radius: number;

	private innerRadius: number;

	private position = new Vector2(0, 0);

	private removeLastValue: boolean;

	private _visible = false;

	private hiddenClassName = 'hidden';

	constructor({ className, size, removeLastValue }: JoystickProps) {
		this.canvas = document.createElement('canvas');
		this.canvas.classList.add(className);
		this.canvas.height = this.canvas.width = size;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.radius = this.canvas.width / 2;
		this.innerRadius = this.radius / 2;
		this.removeLastValue = removeLastValue;
		this.visible = false;

		this.addListeners();
		this.draw();
	}

	get visible() {
		return this._visible;
	}

	set visible(value) {
		this.canvas.classList[value ? 'remove' : 'add'](this.hiddenClassName);
		this._visible = value;
	}

	get data() {
		return this.position.normalize();
	}

	get isUp() {
		return this.position.y <= -((this.radius - this.innerRadius) / 2);
	}

	get isDown() {
		return this.position.y >= (this.radius - this.innerRadius) / 2;
	}

	get isRight() {
		return this.position.x >= (this.radius - this.innerRadius) / 2;
	}

	get isLeft() {
		return this.position.x <= -((this.radius - this.innerRadius) / 2);
	}

	addListeners() {
		this.canvas.addEventListener('touchmove', (e: TouchEvent) => {
			if (!e.target || !(e.target instanceof HTMLElement)) return;

			const rect = e.target.getBoundingClientRect();
			const x = e.targetTouches[0].pageX - rect.left;
			const y = e.targetTouches[0].pageY - rect.top;

			this.position = new Vector2(
				x - this.canvas.width / 2,
				y - this.canvas.height / 2,
			).clampLength(0, this.radius - this.innerRadius);

			this.draw();
		});

		this.canvas.addEventListener('touchstart', (e: TouchEvent) => {
			if (!e.target || !(e.target instanceof HTMLElement)) return;

			const rect = e.target.getBoundingClientRect();
			const x = e.targetTouches[0].pageX - rect.left;
			const y = e.targetTouches[0].pageY - rect.top;

			this.position = new Vector2(
				x - this.canvas.width / 2,
				y - this.canvas.height / 2,
			).clampLength(0, this.radius - this.innerRadius);

			this.draw();
		});

		this.canvas.addEventListener('touchend', () => {
			if (this.removeLastValue) {
				this.position = new Vector2(0, 0);
			}

			this.draw();
		});
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = 'white';
		this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
		this.ctx.arc(0, 0, this.radius - 2, 0, Math.PI * 2);
		this.ctx.stroke();

		this.ctx.beginPath();
		const { x, y } = this.position;
		this.ctx.arc(x, y, this.innerRadius, 0, Math.PI * 2);
		this.ctx.fillStyle = 'white';
		this.ctx.fill();
		this.ctx.restore();
	}

	append(parent: HTMLElement) {
		parent.appendChild(this.canvas);

		return this;
	}

	remove() {
		this.canvas.remove();
	}

	show() {
		this.visible = true;
	}
}
