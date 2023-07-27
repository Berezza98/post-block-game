import Game from './Game';
try {
	const game = new Game({
		// gui: true,
		// controls: true,
	});

	game.start();
} catch (e) {
	document.write(JSON.stringify(e));
}
