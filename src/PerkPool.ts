import { Scene, Vector3 } from 'three';
import Perk, { PERK_EVENTS } from './Perk';
import Ground from './Ground';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import IUpdatable from './types/Updatable.interface';

export default class PerkPool implements IUpdatable {
	name = 'perk-pool';

	size = 1;

	diedCounter = 0;

	collection: Perk[] = [];

	creationTimeouts: number[] = [];

	constructor(
		private ground: Ground,
		private scene: Scene,
	) {
		this.fill();
	}

	get object() {
		return this.collection.map((perk) => perk);
	}

	fill() {
		new Array(this.size - this.collection.length).fill(null).forEach(() => {
			this.add();
		});
	}

	add() {
		const timeToCreation = randInt(2, 5);

		const perk = new Perk(this.scene, this.ground);
		this.collection.push(perk);

		const creationTimeout = setTimeout(() => {
			this.creationTimeouts = this.creationTimeouts.filter(
				(timeouId) => timeouId !== creationTimeout,
			);

			const maxXPosition = this.ground.width / 2 - perk.size / 2;
			perk.pos = new Vector3(randFloat(-maxXPosition, maxXPosition), 2, 3);
			perk.addEventListener(PERK_EVENTS.DIE, this.perkDieHandler.bind(this, perk));

			perk.render();
		}, timeToCreation * 1000);

		this.creationTimeouts.push(creationTimeout);
	}

	remove(perk: Perk) {
		this.collection = this.collection.filter((el) => el !== perk);
		perk.dispose();
	}

	perkDieHandler(perk: Perk) {
		this.diedCounter++;
		this.remove(perk);

		if (this.diedCounter % 10 === 0) this.size++;

		this.fill();
	}

	update() {
		for (const element of this.collection) {
			element.update();
		}
	}
}
