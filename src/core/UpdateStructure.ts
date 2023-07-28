import IUpdatable from '../types/Updatable.interface';

export class UpdateStructure<TUpdatable extends IUpdatable = IUpdatable> implements IUpdatable {
	protected collection: TUpdatable[] = [];

	add(...items: TUpdatable[]) {
		this.collection.push(...items);
	}

	remove(item: TUpdatable) {
		this.collection = this.collection.filter((el) => el !== item);
	}

	protected includes(item: TUpdatable): boolean {
		return this.collection.includes(item);
	}

	update() {
		const innerUpdate = (elements: IUpdatable[]) => {
			for (const item of elements) {
				item.update();

				if (item.innerObjects) innerUpdate(item.innerObjects.collection);
			}
		};

		innerUpdate(this.collection);
	}
}
