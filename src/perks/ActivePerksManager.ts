import { PerkType } from '../types/PerkTypes';
import { ActivePerkFabric } from './ActivePerkFabric';
import Player from '../Player';
import { ACTIVE_PERK_EVENTS, ActivePerk } from './ActivePerk';

export class ActivePerksManager {
	collection: ActivePerk[] = [];

	private activePerkFabric = new ActivePerkFabric(this.player);

	constructor(private player: Player) {}

	getExistedType(type: PerkType): ActivePerk | undefined {
		return this.collection.find((perk: ActivePerk) => perk.type === type);
	}

	add(type: PerkType) {
		const existed = this.getExistedType(type);
		if (existed) this.remove(existed);

		const newPerk = this.activePerkFabric.create(type);

		newPerk.addEventListener(ACTIVE_PERK_EVENTS.REMOVED, () => {
			this.remove(newPerk);
		});

		this.collection.push(newPerk);
	}

	remove(perk: ActivePerk) {
		this.collection = this.collection.filter((p) => p !== perk);

		perk.remove();
	}
}
