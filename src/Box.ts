import { BoxGeometry, MeshStandardMaterial, Mesh, Scene, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';
import { randomRange } from './utils/randomRange';
import ControllableElement from './types/ControllableElement.interface';
import controller, { KEYS } from './Controller';
import Ground from './Ground';

const SIZE = 0.4;

export default class Box implements GameElement, ControllableElement {
	geometry = new BoxGeometry(SIZE, SIZE, SIZE);

	controller = controller;

	name = 'box';

	ground: Ground;

	pos: Vector3;

	acc = new Vector3(0, 0, 0);

	vel: Vector3;

	material = new MeshStandardMaterial({
		color: 0x00ff00
	});

	object = new Mesh(this.geometry, this.material);

	constructor(ground: Ground) {
		this.ground = ground;
		this.pos = new Vector3(0, -2, randomRange(1, 2));
		this.vel = new Vector3(0, 0, 0);
		this.object.position.set(0, 0, 0);

		this.object.receiveShadow = true;
		this.object.castShadow = true;
	}

	get isFlying() {
		return this.pos.z - SIZE / 2 > this.ground.object.position.z;
	}

	addGravity() {
		const gravity = new Vector3(0, 0, -0.01);

		this.acc = this.acc.add(gravity);
	}

	addFriction() {
		const coef = this.isFlying ? 0.9 : 0.8;

		this.vel = this.vel.multiplyScalar(coef);
	}

	checkGroundCollision() {
		if (!this.isFlying) {
			this.pos.z = this.ground.object.position.z + SIZE / 2;
			this.vel.multiply(new Vector3(1, 1, -0.99));
			return;
		}
	}

	checkBorders() {
		const groundBorder = this.ground.geometry.parameters.width / 2;
		const boxSize = this.geometry.parameters.width;

		if (this.pos.x + (boxSize / 2) > groundBorder) {
			this.pos.x = groundBorder - (boxSize / 2);
		}

		if (this.pos.x - (boxSize / 2) < -groundBorder) {
			this.pos.x = -groundBorder + (boxSize / 2);
		}
	}

	handlePositionChange() {
		const forceValue = this.isFlying ? 0.006 : 0.01;

		if (this.controller.keysDown[KEYS.LEFT]) {
			this.acc.add(new Vector3(-forceValue, 0, 0));
		}

		if (this.controller.keysDown[KEYS.RIGHT]) {
			this.acc.add(new Vector3(forceValue, 0, 0));
		};
	}

	handleJump() {
		if (!this.controller.keysDown[KEYS.SPACE] || this.object.position.z > SIZE / 2) return;
		this.acc = this.acc.add(new Vector3(0, 0, 0.2));
	}
	
	controlsHandlers() {
		this.handleJump();
		this.handlePositionChange();
	}
	
	update() {
		this.addGravity();
		this.addFriction();
		this.controlsHandlers();
		
		this.vel = this.vel.add(this.acc);
		// console.log(this.vel, this.acc);
		this.pos = this.pos.add(this.vel);

		this.acc.set(0, 0, 0);

		this.checkBorders();
		this.checkGroundCollision();

		this.object.position.copy(this.pos);
	}
}