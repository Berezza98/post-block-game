import {
	Mesh,
	PlaneGeometry,
	DoubleSide,
	MeshStandardMaterial,
} from 'three';
import GameElement from './types/GameElement.inteface';

export default class Ground implements GameElement {
	geometry = new PlaneGeometry(4, 8);

	name = 'ground';
	
	material = new MeshStandardMaterial({
		color: 0x0000ff,
		side: DoubleSide
	});
	
	object = new Mesh(this.geometry, this.material);

	constructor() {
		this.object.receiveShadow = true;
	}

	get rotation() {
		return this.object.rotation;
	}

	update() {
	}
}