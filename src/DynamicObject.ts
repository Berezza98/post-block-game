import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Scene, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';
import Ground from './Ground';

export const DYNAMIC_OBJECT_EVENTS = {
	POSITION_X_CHANGED: 'POSITION_X_CHANGED',
};

type DynamicObjectProps<TGeometry, TMaterial> = {
	size: number;
	scene: Scene;
	ground: Ground;
	pos?: Vector3;
	geometry: TGeometry;
	material: TMaterial;
};

export default abstract class DynamicObject<
		TGeometry extends BufferGeometry<NormalBufferAttributes>,
		TMaterial extends Material,
	>
	extends Mesh<TGeometry, TMaterial>
	implements GameElement
{
	vel = new Vector3();

	acc = new Vector3();

	rendered = false;

	pos: Vector3;

	scene: Scene;

	ground: Ground;

	size: number;

	abstract beforeUpdate?(): void;

	abstract beforeSetNewPosition?(): void;

	abstract afterUpdate?(): void;

	constructor(props: DynamicObjectProps<TGeometry, TMaterial>) {
		const { geometry, material, scene, ground, size, pos = new Vector3() } = props;

		super(geometry, material);

		this.scene = scene;
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
		if (!this.rendered) return;

		this.addGravityForce();
		this.addFrictionForce();

		this.beforeUpdate?.();

		this.vel = this.vel.add(this.acc);
		this.pos = this.pos.add(this.vel);

		this.acc.set(0, 0, 0);

		this.checkGroundCollision();

		this.beforeSetNewPosition?.();

		if (Math.abs(this.vel.x) > 0.0001) {
			this.dispatchEvent({ type: DYNAMIC_OBJECT_EVENTS.POSITION_X_CHANGED, message: this.pos });
		}

		this.position.copy(this.pos);

		this.afterUpdate?.();
	}

	render() {
		this.position.copy(this.pos);

		this.scene.add(this);

		this.rendered = true;
	}

	dispose() {
		this.material.dispose();
		this.geometry.dispose();
		this.scene.remove(this);

		this.rendered = false;
	}
}
