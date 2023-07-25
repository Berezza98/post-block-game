import { randInt } from 'three/src/math/MathUtils';
import { PerkEffect, PerkType } from '../types/PerkTypes';
import { EventDispatcher } from 'three';

export const ACTIVE_PERK_EVENTS = {
	REMOVED: 'ACTIVE_PERK_REMOVED',
};

export class ActivePerk extends EventDispatcher {
	type: PerkType;

	timerId: number;

	constructor(
		type: PerkType,
		private handler: PerkEffect,
	) {
		super();

		this.type = type;

		this.execute();
	}

	private execute() {
		const randomPerkTime = randInt(3, 10);

		this.handler.onAdd();
		this.timerId = setTimeout(() => {
			this.handler.onRemove();
			this.dispatchEvent({ type: ACTIVE_PERK_EVENTS.REMOVED });
		}, randomPerkTime * 1000);
	}

	remove(shouldRemoveEffect = false) {
		clearTimeout(this.timerId);

		if (shouldRemoveEffect) this.handler.onRemove();
	}
}
