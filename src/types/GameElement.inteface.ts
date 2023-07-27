import IUpdatable from './Updatable.interface';
import IRenderable from './Renderable.interface';
import { IDisposable } from './Disposable.interface';

export default interface GameElement extends IUpdatable, IRenderable, IDisposable {}
