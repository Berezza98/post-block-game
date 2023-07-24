import { BufferGeometry, Event, Material, Object3D, Scene, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';
import Ground from './Ground';
import { EventEmitter } from './EventEmitter';

export const DYNAMIC_OBJECT_EVENTS = {
	POSITION_X_CHANGED: 'POSITION_X_CHANGED',
};

type DynamicObjectProps = {
	size: number;
	geometry: BufferGeometry;
	material: Material;
	object: new (...args: any[]) => Object3D;
	scene: Scene;
	ground: Ground;
	pos?: Vector3;
};

export default abstract class DynamicObject extends EventEmitter implements GameElement {
	abstract name: string;

	vel = new Vector3();

	acc = new Vector3();

	pos: Vector3;

	scene: Scene;

	geometry: BufferGeometry;

	material: Material;

	object: Object3D;

	ground: Ground;

	size: number;

	abstract beforeUpdate?(): void;

	abstract beforeSetNewPosition?(): void;

	abstract afterUpdate?(): void;

	constructor(props: DynamicObjectProps) {
		super();

		const {
			scene,
			geometry,
			material,
			object: ObjectConstructor,
			ground,
			size,
			pos = new Vector3(),
		} = props;

		this.scene = scene;
		this.geometry = geometry;
		this.material = material;
		this.object = new ObjectConstructor(this.geometry, this.material);
		this.ground = ground;
		this.size = size;
		this.pos = pos;
	}

	get onGround() {
		return this.pos.z <= this.ground.object.position.z + this.size / 2;
	}

	addGravityForce() {
		const gravity = new Vector3(0, 0, -0.01);

		this.acc.add(gravity);
	}

	addFrictionForce() {
		const frictionCoef = 0.008;
		const frictionForce = new Vector3()
			.copy(this.vel)
			.normalize()
			.multiplyScalar(-1 * frictionCoef);

		this.acc.add(frictionForce);
	}

	checkGroundCollision() {
		if (this.onGround) {
			this.pos.z = this.ground.object.position.z + this.size / 2;

			this.vel.multiply(new Vector3(1, 1, -0.6));
			return;
		}
	}

	update() {
		this.addGravityForce();
		this.addFrictionForce();

		this.beforeUpdate?.();

		this.vel = this.vel.add(this.acc);
		this.pos = this.pos.add(this.vel);

		this.acc.set(0, 0, 0);

		this.checkGroundCollision();

		this.beforeSetNewPosition?.();

		if (Math.abs(this.vel.x) > 0.0001) {
			this.emit(DYNAMIC_OBJECT_EVENTS.POSITION_X_CHANGED, this.pos);
		}

		this.object.position.copy(this.pos);

		this.afterUpdate?.();
	}

	render() {
		this.object.position.copy(this.pos);

		this.scene.add(this.object);
	}

	dispose() {
		this.material.dispose();
		this.geometry.dispose();
		this.scene.remove(this.object);
	}
}
