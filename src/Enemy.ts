import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import DynamicObject from './DynamicObject';
import Ground from './Ground';
import { randomRange } from './utils/randomRange';
import { randFloat } from 'three/src/math/MathUtils';

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

	constructor(ground: Ground, position: Vector3) {
		super(ground);

		this.object.position.copy(position);
		this.pos = position;

		this.object.receiveShadow = true;
		this.object.castShadow = true;
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

		this.acc.add(new Vector3(0, randFloat(-0.03, -0.00001), 0));
	}

	beforeSetNewPosition(): void {
		this.appendWalkForce();
	}

	beforeUpdate(): void {}

	afterUpdate(): void {
		this.checkOutOfGround();
	}
}