import { Object3D, Scene } from 'three';
import IUpdatable from './Updatable.interface';
import IRenderable from './Renderable.interface';

export default interface GameElement extends IUpdatable, IRenderable {
	object: Object3D | Object3D[];
	name: string;
}
