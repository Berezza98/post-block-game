import { PerkEffect, PerkType } from '../types/PerkTypes';
import { ActivePerk } from './ActivePerk';
import Player from '../Player';

export class ActivePerkFabric {
	constructor(private player: Player) {}

	private perkHandlers: Record<PerkType, () => PerkEffect> = {
		shield: this.getShieldPerk.bind(this),
	};

	private getShieldPerk(): PerkEffect {
		return {
			onAdd: () => {
				this.player.hasShield = true;
			},
			onRemove: () => {
				this.player.hasShield = false;
			},
		};
	}

	create(type: PerkType) {
		return new ActivePerk(type, this.perkHandlers[type]());
	}
}
