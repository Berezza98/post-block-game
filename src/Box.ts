import { BoxGeometry, MeshStandardMaterial, Mesh, Scene } from 'three';
import GameElement from './types/GameElement.inteface';

export default class Box implements GameElement {
	geometry = new BoxGeometry(1, 1, 1);

	name = 'box';

	material = new MeshStandardMaterial({
		color: 0x00ff00
	});

	object = new Mesh(this.geometry, this.material);

	constructor() {
	}

	update() {

	}
}