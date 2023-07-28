import { UpdateStructure } from '../core/UpdateStructure';

export default interface IUpdatable {
	update(): void;
	innerObjects?: UpdateStructure;
}
