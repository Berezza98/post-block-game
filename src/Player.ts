import { BoxGeometry, MeshStandardMaterial, Mesh, Vector3, Box3 } from 'three';
import ControllableElement from './types/ControllableElement.interface';
import controller, { KEYS } from './Controller';
import Ground from './Ground';
import DynamicObject from './DynamicObject';
import Enemy from './Enemy';
import EnemyPool from './EnemyPool';

export const PLAYER_EVENTS = {
	POSITION_CHANGED: 'POSITION_CHANGED',
};

export default class Player extends DynamicObject implements ControllableElement {
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

		this.pos = new Vector3(0, -this.ground.height / 2 + 1, 2);
		this.vel = new Vector3(0, 0, 0);

		this.object.receiveShadow = true;
		this.object.castShadow = true;
	}

	get isFlying() {
		return this.pos.z - this.size / 2 > this.ground.object.position.z;
	}

	get minX() {
		const groundBorder = this.ground.width / 2;

		return -groundBorder + this.size / 2;
	}

	get maxX() {
		const groundBorder = this.ground.width / 2;

		return groundBorder - this.size / 2;
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
		if (this.pos.x > this.maxX) {
			this.pos.x = this.maxX;
		}

		if (this.pos.x < this.minX) {
			this.pos.x = this.minX;
		}
	}

	handlePositionChange() {
		const forceValue = this.isFlying ? 0.006 : 0.01;

		if (this.controller.keysDown[KEYS.LEFT]) {
			this.acc.add(new Vector3(-forceValue, 0, 0));
			this.emit(PLAYER_EVENTS.POSITION_CHANGED, this.pos);
		}

		if (this.controller.keysDown[KEYS.RIGHT]) {
			this.acc.add(new Vector3(forceValue, 0, 0));
			this.emit(PLAYER_EVENTS.POSITION_CHANGED, this.pos);
		}
	}

	handleJump() {
		if (this.controller.keysDown[KEYS.SPACE] && !this.isFlying) {
			this.acc = this.acc.add(new Vector3(0, 0, 0.17));

			return;
		}
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
