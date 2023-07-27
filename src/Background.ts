import { Vector2 } from 'three';
import { createCanvas } from './helpers/createCanvas';
import { randInt } from 'three/src/math/MathUtils';

export default class Background {
	ctx: CanvasRenderingContext2D;

	starLength = 200;

	stars: Star[] = [];

	static animation: number | null = null;
	static instance: Background | null = null;

	static create() {
		if (!Background.instance) {
			Background.instance = new Background();
		}

		return Background.instance;
	}

	static remove() {
		if (!Background.instance) return;

		if (Background.animation) cancelAnimationFrame(Background.animation);

		Background.instance.ctx.canvas.remove();

		Background.instance = null;
	}

	constructor() {
		this.ctx = createCanvas('bg');

		this.init();
	}

	init() {
		for (let i = 0; i < this.starLength; i++) {
			this.stars.push(new Star(this.ctx));
		}
	}

	update() {
		this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		this.stars = this.stars.filter((star) => star.isAlive);

		for (let i = 0; i < this.starLength - this.stars.length; i++) {
			this.stars.push(new Star(this.ctx));
		}

		this.draw();

		this.stars.forEach((star) => star.update());
		Background.animation = requestAnimationFrame(this.update.bind(this));
	}

	draw() {
		const { width, height } = this.ctx.canvas;
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, width, height);
		this.ctx.restore();
	}

	start() {
		this.update();
	}
}

class Star {
	position = new Vector2(randInt(0, window.innerWidth), randInt(0, window.innerHeight));

	live = randInt(100, 1000);

	size = randInt(1, 4);

	constructor(private ctx: CanvasRenderingContext2D) {}

	get isAlive() {
		return this.live > 0;
	}

	update() {
		this.live -= 1;

		this.draw();
	}

	draw() {
		const { x, y } = this.position;

		this.ctx.fillStyle = 'white';
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.size, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}
}
