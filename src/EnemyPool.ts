import { Object3D, Event, Scene } from 'three';
import Enemy, { ENEMY_EVENTS } from './Enemy';
import Ground from './Ground';
import GameElement from './types/GameElement.inteface';
import IUpdatable from './types/Updatable.interface';
import { randomRange } from './utils/randomRange';

export default class EnemyPool implements GameElement {
	name = 'enemy-pool';

	size = 4;

	collection: Enemy[] = [];

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
		const halfOfGroundWidth = this.ground.geometry.parameters.width / 2;
		const enemy = new Enemy(this.ground);
		enemy.once(ENEMY_EVENTS.DIE, this.enemyDieHandler.bind(this, enemy));

		enemy.pos.set(randomRange(-halfOfGroundWidth, halfOfGroundWidth), 2, 3);

		this.collection.push(enemy);
		this.scene.add(enemy.object);
	}

	remove(enemy: Enemy) {
		this.collection = this.collection.filter((el) => el !== enemy);
		enemy.dispose();
		this.scene.remove(enemy.object);
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
