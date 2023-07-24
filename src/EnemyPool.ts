import { Scene, Vector3 } from 'three';
import Enemy, { ENEMY_EVENTS } from './Enemy';
import Ground from './Ground';
import { randFloat } from 'three/src/math/MathUtils';
import IUpdatable from './types/Updatable.interface';

export default class EnemyPool implements IUpdatable {
	name = 'enemy-pool';

	size = 4;

	diedCounter = 0;

	collection: Enemy[] = [];

	creationTimeouts: number[] = [];

	constructor(
		private ground: Ground,
		private scene: Scene,
	) {
		this.fill();
	}

	get object() {
		return this.collection.map((enemy) => enemy.object);
	}

	fill() {
		new Array(this.size - this.collection.length).fill(null).forEach(() => {
			this.add();
		});
	}

	add() {
		const timeToCreation = randFloat(0, 3);

		const enemy = new Enemy(this.scene, this.ground);
		this.collection.push(enemy);

		const creationTimeout = setTimeout(() => {
			this.creationTimeouts = this.creationTimeouts.filter(
				(timeouId) => timeouId !== creationTimeout,
			);

			const maxXPosition = this.ground.width / 2 - enemy.size / 2;
			enemy.pos = new Vector3(randFloat(-maxXPosition, maxXPosition), 2, 3);
			enemy.once(ENEMY_EVENTS.DIE, this.enemyDieHandler.bind(this, enemy));

			enemy.render();
		}, timeToCreation * 1000);

		this.creationTimeouts.push(creationTimeout);
	}

	remove(enemy: Enemy) {
		this.collection = this.collection.filter((el) => el !== enemy);
		enemy.dispose();
	}

	enemyDieHandler(enemy: Enemy) {
		this.diedCounter++;
		this.remove(enemy);

		if (this.diedCounter % 10 === 0) this.size++;

		this.fill();
	}

	update() {
		for (const element of this.collection) {
			element.update();
		}
	}
}
