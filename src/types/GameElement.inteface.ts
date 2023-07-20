import { Object3D } from 'three';
import IUpdatable from './Updatable.interface';

export default interface GameElement extends IUpdatable {
	object: Object3D;
	name: string;
}
