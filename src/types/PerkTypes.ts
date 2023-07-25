import { PERK_TYPES } from '../consts/perks';

export type PerkType = (typeof PERK_TYPES)[number];

export interface PerkEffect {
	onAdd: () => void;
	onRemove: () => void;
}
