import Enemy from './Enemy';
import Ground from './Ground';
import IUpdatable from './types/Updatable.interface';
import { randomRange } from './utils/randomRange';

export default class EnemyPool implements IUpdatable {
	size = 3;

	collection: Enemy[] = [];

	constructor(private ground: Ground) {
		this.fill();
	}

	fill() {
		new Array(this.size).fill(null).forEach(() => {
			this.add();
		});
	}

	add() {
		const halfOfGroundWidth = this.ground.geometry.parameters.width / 2;
		const enemy = new Enemy(this.ground);
		enemy.pos.set(randomRange(-halfOfGroundWidth, halfOfGroundWidth), 2, 3);

		this.collection.push(enemy);
	}

	update() {}
}
