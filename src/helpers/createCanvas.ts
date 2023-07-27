export function createCanvas(className: string): CanvasRenderingContext2D {
	const canvas = document.createElement('canvas');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;

	if (className) {
		canvas.classList.add(className);
	}

	document.body.appendChild(canvas);

	return canvas.getContext('2d') as CanvasRenderingContext2D;
}
