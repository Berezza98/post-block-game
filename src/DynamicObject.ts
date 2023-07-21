import { BufferGeometry, Material, Object3D, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';
import Ground from './Ground';
import { EventEmitter } from './EventEmitter';

export default abstract class DynamicObject extends EventEmitter implements GameElement {
	pos = new Vector3();

	vel = new Vector3();

	acc = new Vector3();

	abstract geometry: BufferGeometry;

	abstract material: Material;

	abstract object: Object3D;

	abstract name: string;

	size: number;

	abstract beforeUpdate?(): void;

	abstract beforeSetNewPosition?(): void;

	abstract afterUpdate?(): void;

	constructor(protected ground: Ground) {
		super();
	}

	get onGround() {
		return this.pos.z - this.size / 2 <= this.ground.object.position.z;
	}

	addGravity() {
		const gravity = new Vector3(0, 0, -0.01);

		this.acc = this.acc.add(gravity);
	}

	addFriction() {
		const coef = this.onGround ? 0.8 : 0.7;

		this.vel = this.vel.multiply(new Vector3(coef, coef, 1));
	}

	checkGroundCollision() {
		if (this.onGround) {
			this.pos.z = this.ground.object.position.z + this.size / 2;
			this.vel.multiply(new Vector3(1, 1, -0.6));
			return;
		}
	}

	update() {
		this.addGravity();
		this.addFriction();

		this.beforeUpdate?.();

		this.vel = this.vel.add(this.acc);
		this.pos = this.pos.add(this.vel);

		this.acc.set(0, 0, 0);

		this.checkGroundCollision();

		this.beforeSetNewPosition?.();

		this.object.position.copy(this.pos);

		this.afterUpdate?.();
	}
}
