import { AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GUI } from 'dat.gui';
import GameElement from './types/GameElement.inteface';
import Ground from './Ground';
import Box from './Box';

interface GameOptions {
	gui?: boolean;
}

export default class Game {
	scene = new Scene();

	renderer = new WebGLRenderer();

	gui? = false;

	camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	light: DirectionalLight;

	gameElements: GameElement[] = [];

	constructor({ gui }: GameOptions) {
		this.gui = gui;

		this.init();
	}

	setRenderer() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	}

	addGameElements() {
		const ground = new Ground();
		const box = new Box();

		this.gameElements.push(ground);
		this.gameElements.push(box);
	}

	setCameraPosition() {
		this.camera.position.set(0, -3.3, 1.1);
		this.camera.rotation.set(1.3, 0, 0);
	}

	setLight() {
		this.light = new DirectionalLight(0xffffff, 1);
		this.light.position.y = 3;
		this.light.position.z = 1;
		this.light.castShadow = true;

		this.scene.add(this.light);
		this.scene.add(new AmbientLight(0xffffff, 0.5));
	}

	setGui() {
		if (!this.gui) return;

		const gui = new GUI();

		this.gameElements.forEach((element) => {
			const folder = gui.addFolder(element.name);

			folder.add(element.object.rotation, 'x', -Math.PI * 2, Math.PI * 2, 0.1).name('Rotation X');
			folder.add(element.object.rotation, 'y', -Math.PI * 2, Math.PI * 2, 0.1).name('Rotation Y');
			folder.add(element.object.rotation, 'z', -Math.PI * 2, Math.PI * 2, 0.1).name('Rotation Z');

			folder.add(element.object.position, 'x', -10, 10, 0.1).name('Position X');
			folder.add(element.object.position, 'y', -10, 10, 0.1).name('Position Y');
			folder.add(element.object.position, 'z', -10, 10, 0.1).name('Position Z');
		});
	}

	init() {
		this.setRenderer();

		this.setCameraPosition();
		this.setLight();

		this.addGameElements();

		this.setGui();

		this.gameElements.forEach((element: GameElement) => {
			this.scene.add(element.object);
		});
	}

	update() {
		this.gameElements.forEach((element: GameElement) => {
			element.update();
		});
	}

	render() {
		this.update();

		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.render.bind(this));
	}
}