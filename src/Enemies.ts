import { Scene, Vector3 } from 'three';
import Enemy, { ENEMY_EVENTS } from './Enemy';
import Ground from './Ground';
import { randFloat } from 'three/src/math/MathUtils';
import { Pool } from './core/Pool';

export class Enemies extends Pool<Enemy> {
	name = 'enemy-pool';

	constructor(
		private ground: Ground,
		private scene: Scene,
	) {
		super({ size: 4 });

		this.fill();
	}

	create() {
		const timeToCreation = randFloat(0, 3);

		const enemy = new Enemy(this.scene, this.ground);

		setTimeout(() => {
			if (this.disposed) return;

			const maxXPosition = this.ground.width / 2 - enemy.size / 2;
			enemy.pos = new Vector3(randFloat(-maxXPosition, maxXPosition), 2, 3);

			enemy.addEventListener(ENEMY_EVENTS.DIE, () => {
				this.remove(enemy);
			});

			enemy.render();
		}, timeToCreation * 1000);

		return enemy;
	}

	increaseCondition() {
		if (this.restored % 10 === 0) return 1;
	}
}
