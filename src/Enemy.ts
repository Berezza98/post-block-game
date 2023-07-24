import { BoxGeometry, Mesh, MeshStandardMaterial, Scene, Vector3 } from 'three';
import DynamicObject from './DynamicObject';
import Ground from './Ground';
import { randFloat } from 'three/src/math/MathUtils';

export const ENEMY_EVENTS = {
	DIE: 'ENEMY_DIE',
};

export default class Enemy extends DynamicObject {
	name = 'enemy';

	speed = randFloat(0.008, 0.01);

	constructor(scene: Scene, ground: Ground) {
		const size = 0.4;
		const geometry = new BoxGeometry(size, size, size);
		const material = new MeshStandardMaterial({
			color: 0xff0000,
		});

		super({
			size,
			ground,
			scene,
			geometry,
			material,
			object: Mesh,
		});

		this.object.receiveShadow = true;
		this.object.castShadow = true;
	}

	checkOutOfGround() {
		if (this.pos.y + this.size / 2 < -this.ground.height / 2) {
			this.emit(ENEMY_EVENTS.DIE);
		}
	}

	appendRunSpeed() {
		if (!this.onGround) return;

		this.acc.add(new Vector3(0, -this.speed, 0));
	}

	beforeSetNewPosition(): void {
		this.appendRunSpeed();
	}

	beforeUpdate(): void {}

	afterUpdate(): void {
		this.checkOutOfGround();
	}
}
