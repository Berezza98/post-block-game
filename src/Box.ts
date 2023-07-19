import { BoxGeometry, MeshStandardMaterial, Mesh, Scene, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';
import { randomRange } from './utils/randomRange';
import ControllableElement from './types/ControllableElement.interface';
import controller, { KEYS } from './Controller';

const SIZE = 0.4;

export default class Box implements GameElement, ControllableElement {
	geometry = new BoxGeometry(SIZE, SIZE, SIZE);

	controller = controller;

	name = 'box';

	pos: Vector3;

	dir: Vector3;

	vel: Vector3;

	material = new MeshStandardMaterial({
		color: 0x00ff00
	});

	object = new Mesh(this.geometry, this.material);

	constructor() {
		this.pos = new Vector3(0, -2, randomRange(1, 2));
		this.vel = new Vector3(0, 0, 0);
		this.dir = new Vector3(0, 0, 0.01);
		this.object.position.set(0, 0, 0);
	}

	checkGroundCollision() {
		if (this.pos.z - SIZE / 2 < 0) {
			this.pos.z = SIZE / 2;
			return;
		}
	}

	jump() {
		if (!this.controller.keysDown[KEYS.SPACE]) return;

		this.vel = this.vel.sub(new Vector3(0, 0, 0.05));
	}

	update() {
		this.jump();

		this.vel = this.vel.add(this.dir);
		this.pos = this.pos.sub(this.vel);

		this.vel.set(0, 0, 0);

		this.checkGroundCollision();

		this.object.position.copy(this.pos);
	}
}