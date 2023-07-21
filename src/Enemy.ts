import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import DynamicObject from './DynamicObject';
import Ground from './Ground';
import { randFloat } from 'three/src/math/MathUtils';

export const ENEMY_EVENTS = {
	DIE: 'ENEMY_DIE',
};

export default class Enemy extends DynamicObject {
	name = 'enemy';

	size = 0.4;

	geometry = new BoxGeometry(this.size, this.size, this.size);

	material = new MeshStandardMaterial({
		color: 0xff0000,
	});

	object = new Mesh(this.geometry, this.material);

	constructor(ground: Ground) {
		super(ground);

		this.object.receiveShadow = true;
		this.object.castShadow = true;
	}

	checkOutOfGround() {
		if (this.pos.y + this.size / 2 < -this.ground.height / 2) {
			this.emit(ENEMY_EVENTS.DIE);
		}
	}

	dispose() {
		this.material.dispose();
		this.geometry.dispose();
	}

	appendRunSpeed() {
		if (!this.onGround) return;

		this.acc.add(new Vector3(0, -randFloat(0.001, 0.01), 0));
	}

	beforeSetNewPosition(): void {
		this.appendRunSpeed();
	}

	beforeUpdate(): void {}

	afterUpdate(): void {
		this.checkOutOfGround();
	}
}
