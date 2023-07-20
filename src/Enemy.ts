import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import DynamicObject from './DynamicObject';
import Ground from './Ground';

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

	appendWalkForce() {
		if (!this.onGround) return;

		this.acc.add(new Vector3(0, -0.01, 0));
	}

	beforeSetNewPosition(): void {
		this.appendWalkForce();
	}

	beforeUpdate(): void {}

	afterUpdate(): void {
		console.log();
	}
}
