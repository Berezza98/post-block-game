import { BoxGeometry, MeshStandardMaterial, Mesh, Vector3, Box3 } from 'three';
import ControllableElement from './types/ControllableElement.interface';
import { randomRange } from './utils/randomRange';
import controller, { KEYS } from './Controller';
import Ground from './Ground';
import DynamicObject from './DynamicObject';
import Enemy from './Enemy';
import EnemyPool from './EnemyPool';

export default class Player extends DynamicObject<BoxGeometry> implements ControllableElement {
	controller = controller;

	size = 0.4;

	name = 'player';

	geometry = new BoxGeometry(this.size, this.size, this.size);

	material = new MeshStandardMaterial({
		color: 0x00ff00,
	});

	object = new Mesh(this.geometry, this.material);

	constructor(
		ground: Ground,
		private enemyPool: EnemyPool,
	) {
		super(ground);

		this.pos = new Vector3(0, -2, randomRange(1, 2));
		this.vel = new Vector3(0, 0, 0);
		this.object.position.set(0, 0, 0);

		this.object.receiveShadow = true;
		this.object.castShadow = true;
	}

	get isFlying() {
		return this.pos.z - this.size / 2 > this.ground.object.position.z;
	}

	checkEnemiesIntersection() {
		let playerBox = new Box3().setFromObject(this.object);

		this.enemyPool.collection.forEach((enemy) => {
			let enemyBox = new Box3().setFromObject(enemy.object);

			const intersection = playerBox.intersectsBox(enemyBox);

			if (intersection) console.log('INTERSECTION !!! ', enemy.object.position);
		});
	}

	checkBorders() {
		const groundBorder = this.ground.geometry.parameters.width / 2;

		const boxSize = this.geometry.parameters.width;

		if (this.pos.x + boxSize / 2 > groundBorder) {
			this.pos.x = groundBorder - boxSize / 2;
		}

		if (this.pos.x - boxSize / 2 < -groundBorder) {
			this.pos.x = -groundBorder + boxSize / 2;
		}
	}

	handlePositionChange() {
		const forceValue = this.isFlying ? 0.006 : 0.01;

		if (this.controller.keysDown[KEYS.LEFT]) {
			this.acc.add(new Vector3(-forceValue, 0, 0));
		}

		if (this.controller.keysDown[KEYS.RIGHT]) {
			this.acc.add(new Vector3(forceValue, 0, 0));
		}
	}

	handleJump() {
		if (!this.controller.keysDown[KEYS.SPACE] || this.object.position.z > this.size / 2) return;
		this.acc = this.acc.add(new Vector3(0, 0, 0.17));
	}

	controlsHandlers() {
		this.handleJump();
		this.handlePositionChange();
	}

	beforeUpdate(): void {
		this.checkEnemiesIntersection();
		this.controlsHandlers();
	}

	beforeSetNewPosition(): void {
		this.checkBorders();
	}

	afterUpdate(): void {}
}
