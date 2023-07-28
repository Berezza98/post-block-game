import GameElement from '../types/GameElement.inteface';
import { UpdateStructure } from './UpdateStructure';

interface PoolParams {
	size: number;
}

export abstract class Pool<TElement extends GameElement> extends UpdateStructure<TElement> {
	public size: number;

	protected restored: number = 0;

	protected disposed = false;

	constructor({ size }: PoolParams) {
		super();

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

			this.add(element);
		});
	}

	abstract create(): TElement;

	abstract increaseCondition(): number | void;

	public remove(element: TElement) {
		const inCollection = this.includes(element);
		if (!inCollection) return;

		this.restored++;
		super.remove(element);

		element.dispose();

		const increaseValue = this.increaseCondition();

		if (increaseValue) this.increaseSize(increaseValue);

		this.fill();
	}

	public dispose() {
		this.disposed = true;
	}
}
