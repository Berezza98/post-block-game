import Game from './Game';
try {
	console.log('try to start');
	const game = new Game({
		// gui: true,
		// controls: true,
	});

	game.start();
} catch (e) {
	console.log(e);
}
