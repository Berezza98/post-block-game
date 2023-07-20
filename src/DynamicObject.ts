import { BufferGeometry, Material, Object3D, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';

export default abstract class DynamicObject implements GameElement {
	pos = new Vector3();

	vel = new Vector3();

	acc = new Vector3();

	geometry: BufferGeometry;

	material: Material;

	object: Object3D;

	name: string;

	constructor(
		geometry: BufferGeometry,
		material: Material,
		objectClass: new (...args: any[]) => Object3D,
		name: string = 'dynamicObject',
	) {
		this.geometry = geometry;
		this.material = material;
		this.object = new objectClass(this.geometry, this.material);
		this.name = name;
	}

	update() {
		this.vel = this.vel.add(this.acc);
		this.pos = this.pos.add(this.vel);

		this.acc.set(0, 0, 0);

		this.object.position.copy(this.pos);
	}
}
