import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import GameElement from './types/GameElement.inteface';

export default class Enemy implements GameElement {
	pos = new Vector3();

	vel = new Vector3();

	acc = new Vector3();

	name = 'enemy';

	size = 0.4;

	geometry = new BoxGeometry(this.size, this.size, this.size);

	material = new MeshStandardMaterial({
		color: 0xff0000,
	});

	object = new Mesh(this.geometry, this.material);

	constructor() {}

	update() {}
}
