import { Object3D } from 'three';

export default interface GameElement {
	update(): void;
	object: Object3D;
	name: string;
}