import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import DynamicObject from './DynamicObject';
import Ground from './Ground';
import { randomRange } from './utils/randomRange';

export const ENEMY_EVENTS = {
	DIE: 'ENEMY_DIE',
};

export default class Enemy extends DynamicObject<BoxGeometry> {
	name = 'enemy';

	size = 0.4;

	geometry = new BoxGeometry(this.size, this.size, this.size);

	material = new MeshStandardMaterial({
		color: 0xff0000,
	});

	object = new Mesh(this.geometry, this.material);

	constructor(ground: Ground) {
		super(ground);
	}

	checkOutOfGround() {
		this.ground.object.geometry.computeBoundingBox();
		const box = this.ground.object.geometry.boundingBox;

		if (!box) return;

		if (this.pos.y + this.size / 2 < box.min.y) {
			this.emit(ENEMY_EVENTS.DIE);
		}
	}

	dispose() {
		this.material.dispose();
		this.geometry.dispose();
	}

	appendWalkForce() {
		if (!this.onGround) return;

		this.acc.add(new Vector3(0, randomRange(-0.001, -0.03), 0));
	}

	beforeSetNewPosition(): void {
		this.appendWalkForce();
	}

	beforeUpdate(): void {}

	afterUpdate(): void {
		this.checkOutOfGround();
	}
}
