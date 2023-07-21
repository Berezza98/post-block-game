import { BufferGeometry, Event, Material, Object3D, Scene, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';
import Ground from './Ground';
import { EventEmitter } from './EventEmitter';
import Enemy from './Enemy';

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
