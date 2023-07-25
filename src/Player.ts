import { BoxGeometry, MeshStandardMaterial, Mesh, Vector3, Box3, Scene } from 'three';
import ControllableElement from './types/ControllableElement.interface';
import controller, { KEYS } from './Controller';
import Ground from './Ground';
import DynamicObject from './DynamicObject';
import EnemyPool from './EnemyPool';
import PerkPool from './PerkPool';
import { ActivePerksManager } from './perks/ActivePerksManager';

export const PLAYER_EVENTS = {
	PLAYER_COLLISION: 'PLAYER_COLLISION',
};

interface PlayerProps {
	scene: Scene;
	ground: Ground;
	enemyPool: EnemyPool;
	perkPool: PerkPool;
}

export default class Player
	extends DynamicObject<BoxGeometry, MeshStandardMaterial>
	implements ControllableElement
{
	private enemyPool: EnemyPool;

	private perkPool: PerkPool;

	private activePerksManager = new ActivePerksManager(this);

	controller = controller;

	name = 'player';

	jumpForce = 0.2;

	_hasShield = false;

	constructor({ scene, ground, enemyPool, perkPool }: PlayerProps) {
		const size = 0.4;
		const geometry = new BoxGeometry(size, size, size);
		const material = new MeshStandardMaterial({
			color: 0x00ff00,
		});
		const pos = new Vector3(0, -ground.height / 2 + 1, 2);

		super({
			size,
			scene,
			ground,
			pos,
			geometry,
			material,
		});

		this.enemyPool = enemyPool;
		this.perkPool = perkPool;

		this.vel = new Vector3(0, 0, 0);

		this.receiveShadow = true;
		this.castShadow = true;
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

	get hasShield() {
		return this._hasShield;
	}

	set hasShield(value) {
		if (value) {
			this.material.color.setHex(0x0000ff);
		} else {
			this.material.color.setHex(0x00ff00);
		}

		this._hasShield = value;
	}

	private checkEnemiesIntersection() {
		let playerBox = new Box3().setFromObject(this);
		this.enemyPool.collection.forEach((enemy) => {
			let enemyBox = new Box3().setFromObject(enemy);
			const intersection = playerBox.intersectsBox(enemyBox);
			if (intersection) {
				if (this.hasShield) {
					this.enemyPool.enemyDieHandler(enemy);
					return;
				}

				console.log('INTERSECTION !!! ');
				this.dispatchEvent({ type: PLAYER_EVENTS.PLAYER_COLLISION });
			}
		});
	}

	private checkPerkIntersection() {
		let playerBox = new Box3().setFromObject(this);
		this.perkPool.collection.forEach((perk) => {
			let perkBox = new Box3().setFromObject(perk);
			const intersection = playerBox.intersectsBox(perkBox);
			if (intersection) {
				this.activePerksManager.add(perk.type);
				this.perkPool.perkDieHandler(perk);
			}
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
		const forceValue = 0.01;

		if (this.controller.keysDown[KEYS.LEFT] && this.pos.x > this.minX) {
			this.acc.add(new Vector3(-forceValue, 0, 0));
		}

		if (this.controller.keysDown[KEYS.RIGHT] && this.pos.x < this.maxX) {
			this.acc.add(new Vector3(forceValue, 0, 0));
		}
	}

	handleJump() {
		if (this.controller.keysDown[KEYS.SPACE] && !this.isFlying) {
			this.vel.setZ(this.jumpForce);
			return;
		}
	}

	controlsHandlers() {
		this.handleJump();
		this.handlePositionChange();
	}

	beforeUpdate(): void {
		this.checkEnemiesIntersection();
		this.checkPerkIntersection();
		this.controlsHandlers();
	}

	beforeSetNewPosition(): void {
		this.checkBorders();
	}

	afterUpdate(): void {
		// console.log(this.vel);
	}
}
