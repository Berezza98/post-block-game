export class EventEmitter {
	events: Record<string, ((...args: any) => any)[]>;

	constructor() {
		this.events = {};
	}
	on(event: string, listener: (...args: any) => any) {
		if (typeof this.events[event] !== 'object') {
			this.events[event] = [];
		}
		this.events[event].push(listener);
		return () => this.removeListener(event, listener);
	}
	removeListener(event: string, listener: (...args: any) => any) {
		if (typeof this.events[event] === 'object') {
			const idx = this.events[event].indexOf(listener);
			if (idx > -1) {
				this.events[event].splice(idx, 1);
			}
		}
	}
	emit(event: string, ...args: any) {
		if (typeof this.events[event] === 'object') {
			this.events[event].forEach((listener) => listener.apply(this, args));
		}
	}
	once(event: string, listener: (...args: any) => any) {
		const remove = this.on(event, (...args) => {
			remove();
			listener.apply(this, args);
		});
	}
}
