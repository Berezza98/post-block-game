import GameElement from '../types/GameElement.inteface';
import IUpdatable from '../types/Updatable.interface';

interface PoolParams {
	size: number;
}

export abstract class Pool<TElement extends GameElement> implements IUpdatable {
	public collection: TElement[] = [];

	public size: number;

	protected restored: number = 0;

	protected disposed = false;

	constructor({ size }: PoolParams) {
		this.size = size;
	}

	[Symbol.iterator]() {
		return this.collection[Symbol.iterator]();
	}

	private increaseSize(increaseValue: number): void {
		this.size += increaseValue;
	}

	protected fill() {
		new Array(this.size - this.collection.length).fill(null).forEach(() => {
			const element = this.create();

			this.collection.push(element);
		});
	}

	abstract create(): TElement;

	abstract increaseCondition(): number | void;

	public remove(element: TElement) {
		const inCollection = this.collection.find((el) => el === element);
		if (!inCollection) return;

		this.restored++;
		this.collection = this.collection.filter((el) => el !== element);
		element.dispose();

		const increaseValue = this.increaseCondition();

		if (increaseValue) this.increaseSize(increaseValue);

		this.fill();
	}

	public update() {
		for (const element of this.collection) {
			element.update();
		}
	}

	public dispose() {
		this.disposed = true;
	}
}
