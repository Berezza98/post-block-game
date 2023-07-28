import { BoxGeometry, Mesh, MeshStandardMaterial, Scene, Vector3 } from 'three';
import DynamicObject from './core/DynamicObject';
import Ground from './Ground';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { PERK_TYPES } from './consts/perks';
import { PerkType } from './types/PerkTypes';

export default class Perk extends DynamicObject<BoxGeometry, MeshStandardMaterial> {
	name = 'perk';

	speed = randFloat(0.008, 0.01);

	type: PerkType = PERK_TYPES[randInt(0, PERK_TYPES.length - 1)];

	constructor(scene: Scene, ground: Ground) {
		const size = 0.2;
		const geometry = new BoxGeometry(size, size, size);
		const material = new MeshStandardMaterial({
			color: 0x0000ff,
		});

		super({
			size,
			ground,
			scene,
			geometry,
			material,
		});

		this.receiveShadow = true;
		this.castShadow = true;
	}

	checkOutOfGround() {
		if (this.pos.y + this.size / 2 < -this.ground.height / 2) {
			this.kill();
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
