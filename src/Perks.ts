import { Scene, Vector3 } from 'three';
import Perk, { PERK_EVENTS } from './Perk';
import Ground from './Ground';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { Pool } from './core/Pool';

export class Perks extends Pool<Perk> {
	name = 'perk-pool';

	constructor(
		private ground: Ground,
		private scene: Scene,
	) {
		super({ size: 1 });

		this.fill();
	}

	create() {
		const timeToCreation = randInt(2, 5);

		const perk = new Perk(this.scene, this.ground);

		setTimeout(() => {
			if (this.disposed) return;

			const maxXPosition = this.ground.width / 2 - perk.size / 2;
			perk.pos = new Vector3(randFloat(-maxXPosition, maxXPosition), 2, 3);
			perk.addEventListener(PERK_EVENTS.DIE, () => {
				this.remove(perk);
			});

			perk.render();
		}, timeToCreation * 1000);

		return perk;
	}

	increaseCondition() {}
}
