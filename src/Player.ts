import { BoxGeometry, MeshStandardMaterial, Mesh, Vector3, Box3, Scene } from 'three';
import ControllableElement from './types/ControllableElement.interface';
import controller, { KEYS } from './Controller';
import Ground from './Ground';
import DynamicObject from './core/DynamicObject';
import { Enemies } from './Enemies';
import { Perks } from './Perks';
import { ActivePerksManager } from './perks/ActivePerksManager';
import { Joystick } from './Joystick';
import { JumpButton } from './JumpButton';
import { Score } from './Score';

export const PLAYER_EVENTS = {
	PLAYER_COLLISION: 'PLAYER_COLLISION',
};

interface PlayerProps {
	scene: Scene;
	ground: Ground;
	enemies: Enemies;
	perks: Perks;
	joystick?: Joystick;
	jumpButton?: JumpButton;
	score: Score;
}

export default class Player
	extends DynamicObject<BoxGeometry, MeshStandardMaterial>
	implements ControllableElement
{
	private enemies: Enemies;

	private perks: Perks;

	private activePerksManager = new ActivePerksManager(this);

	private maxSpeed = 0.05;

	controller = controller;

	name = 'player';

	score: Score;

	joystick?: Joystick;

	jumpButton?: JumpButton;

	_hasShield = false;

	constructor({ scene, ground, enemies, perks, joystick, jumpButton, score }: PlayerProps) {
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

		this.enemies = enemies;
		this.perks = perks;
		this.joystick = joystick;
		this.jumpButton = jumpButton;
		this.score = score;

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

		for (const enemy of this.enemies) {
			const enemyBox = new Box3().setFromObject(enemy);
			const intersection = playerBox.intersectsBox(enemyBox);

			if (intersection) {
				if (this.hasShield || this.position.z >= enemyBox.max.z) {
					enemy.kill();
					this.score.increase(this.hasShield ? 1 : 2);
					return;
				}

				this.dispatchEvent({ type: PLAYER_EVENTS.PLAYER_COLLISION });
			}
		}
	}

	private checkPerkIntersection() {
		let playerBox = new Box3().setFromObject(this);

		for (const perk of this.perks) {
			let perkBox = new Box3().setFromObject(perk);
			const intersection = playerBox.intersectsBox(perkBox);
			if (intersection) {
				this.activePerksManager.add(perk.type);
				perk.kill();
			}
		}
	}

	checkBorders() {
		if (this.pos.x > this.maxX) {
			this.pos.x = this.maxX;
		}

		if (this.pos.x < this.minX) {
			this.pos.x = this.minX;
		}
	}

	restrictMaxSpeed() {
		if (Math.abs(this.vel.x) > this.maxSpeed) {
			this.vel.setX(Math.sign(this.vel.x) * this.maxSpeed);
		}
	}

	handlePositionChange() {
		const forceValue = this.joystick ? 0.009 : 0.01;

		if (this.joystick) {
			this.acc.add(new Vector3(forceValue * this.joystick.data.x, 0, 0));
			return;
		}

		if (this.controller.keysDown[KEYS.LEFT] && this.pos.x > this.minX) {
			this.acc.add(new Vector3(-forceValue, 0, 0));
		}

		if (this.controller.keysDown[KEYS.RIGHT] && this.pos.x < this.maxX) {
			this.acc.add(new Vector3(forceValue, 0, 0));
		}
	}

	handleJump() {
		const jumpForce = 0.2;

		const mobileJumpBtnPressed = this.jumpButton && this.jumpButton.isPressed;

		if ((this.controller.keysDown[KEYS.SPACE] || mobileJumpBtnPressed) && !this.isFlying) {
			this.vel.setZ(jumpForce);
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
		this.restrictMaxSpeed();
	}

	afterUpdate(): void {
		// console.log(this.vel);
	}
}
