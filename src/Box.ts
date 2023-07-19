import { BoxGeometry, MeshStandardMaterial, Mesh, Scene, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';
import { randomRange } from './utils/randomRange';

const SIZE = 0.4;

export default class Box implements GameElement {
	geometry = new BoxGeometry(SIZE, SIZE, SIZE);

	name = 'box';

	pos: Vector3;

	dir: Vector3;

	vel: Vector3;

	material = new MeshStandardMaterial({
		color: 0x00ff00
	});

	object = new Mesh(this.geometry, this.material);

	constructor() {
		this.pos = new Vector3(0, 0, randomRange(1, 4));
		this.vel = new Vector3(0, 0, 0.01);
		this.object.position.set(0, 0, 0);
	}

	checkGroundCollision() {
		if (this.pos.z - SIZE / 2 < 0) {
			this.pos.z = SIZE / 2;
			return;
		}
	}

	update() {
		this.pos = this.pos.sub(this.vel);

		this.checkGroundCollision();

		this.object.position.copy(this.pos);
	}
}