import Enemy, { ENEMY_EVENTS } from './Enemy';
import Ground from './Ground';
import IUpdatable from './types/Updatable.interface';
import { randomRange } from './utils/randomRange';

export default class EnemyPool implements IUpdatable {
	size = 1;

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
		console.log('add');
		const halfOfGroundWidth = this.ground.geometry.parameters.width / 2;
		const enemy = new Enemy(this.ground);
		enemy.once(ENEMY_EVENTS.DIE, this.enemyDieHandler.bind(this));

		enemy.pos.set(randomRange(-halfOfGroundWidth, halfOfGroundWidth), 2, 3);

		this.collection.push(enemy);
	}

	remove(enemy: Enemy) {
		this.collection = this.collection.filter((el) => el !== enemy);
		console.log(enemy === this.collection[0]);
	}

	enemyDieHandler(enemy: Enemy) {
		console.log('die', this);
		this.remove(enemy);
		this.add();
	}

	update() {}
}
