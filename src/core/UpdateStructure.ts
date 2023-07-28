import IUpdatable from '../types/Updatable.interface';

export class UpdateStructure implements IUpdatable {
	private collection: IUpdatable[] = [];

	add(...items: IUpdatable[]) {
		this.collection.push(...items);
	}

	remove(item: IUpdatable) {
		this.collection = this.collection.filter((el) => el !== item);
	}

	includes(item: IUpdatable): boolean {
		return this.collection.includes(item);
	}

	update() {
		const innerUpdate = (elements: IUpdatable[]) => {
			for (const item of elements) {
				item.update();

				if (item.innerObjects) innerUpdate(item.innerObjects);
			}
		};

		innerUpdate(this.collection);
	}
}
