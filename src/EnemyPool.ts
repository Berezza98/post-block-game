import { Scene, Vector3 } from 'three';
import Enemy, { ENEMY_EVENTS } from './Enemy';
import Ground from './Ground';
import { randFloat } from 'three/src/math/MathUtils';
import IUpdatable from './types/Updatable.interface';

export default class EnemyPool implements IUpdatable {
	name = 'enemy-pool';

	size = 4;

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
		new Array(this.size).fill(null).forEach(() => {
			this.add();
		});
	}

	add() {
		const timeToCreation = randFloat(0, 3);

		const creationTimeout = setTimeout(() => {
			this.creationTimeouts = this.creationTimeouts.filter(
				(timeouId) => timeouId !== creationTimeout,
			);

			const enemy = new Enemy(this.scene, this.ground);

			const maxXPosition = this.ground.width / 2 - enemy.size / 2;
			enemy.pos = new Vector3(randFloat(-maxXPosition, maxXPosition), 2, 3);
			enemy.once(ENEMY_EVENTS.DIE, this.enemyDieHandler.bind(this, enemy));

			this.collection.push(enemy);

			enemy.render();
		}, timeToCreation * 1000);

		this.creationTimeouts.push(creationTimeout);
	}

	remove(enemy: Enemy) {
		this.collection = this.collection.filter((el) => el !== enemy);
		enemy.dispose();
	}

	enemyDieHandler(enemy: Enemy) {
		this.remove(enemy);
		this.add();
	}

	update() {
		for (const element of this.collection) {
			element.update();
		}
	}
}
