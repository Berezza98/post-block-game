export default interface IUpdatable {
	update(): void;
	innerObjects?: IUpdatable[];
}
