import {
	AmbientLight,
	CameraHelper,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GameElement from './types/GameElement.inteface';
import Ground from './Ground';
import Player from './Player';
import Enemy from './Enemy';
import EnemyPool from './EnemyPool';

interface GameOptions {
	gui?: boolean;
	controls?: boolean;
}

export default class Game {
	scene = new Scene();

	renderer = new WebGLRenderer();

	options: GameOptions;

	controls?: OrbitControls;

	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	light: DirectionalLight;

	gameElements: GameElement[] = [];

	ground: Ground;

	constructor(options: GameOptions) {
		this.options = options;

		this.startAnimation().then(() => {
			this.createGameElements();
			this.addGameElements();
		});
	}

	setRenderer() {
		this.renderer.shadowMap.enabled = true;

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	}

	createGameElements() {
		const enemyPool = new EnemyPool(this.ground, this.scene);
		const box = new Player(this.ground, enemyPool);

		this.gameElements.push(...[enemyPool, box]);
	}

	addGameElements() {
		this.gameElements.forEach((element: GameElement) => {
			if (Array.isArray(element.object)) {
				for (const el of element.object) {
					this.scene.add(el);
				}

				return;
			}

			this.scene.add(element.object);
		});
	}

	setCameraPosition() {
		this.camera.position.set(0, -6, 1.1);
		this.camera.rotation.set(1.3, 0, 0);
	}

	setLight() {
		this.light = new DirectionalLight(0xffffff, 1);
		this.light.position.y = 3;
		this.light.position.x = 1;
		this.light.position.z = 2;
		this.light.castShadow = true;

		this.scene.add(this.light);
		this.scene.add(new AmbientLight(0xffffff, 0.5));
	}

	setGui() {
		if (!this.options.gui) return;

		const gui = new GUI();

		// this.gameElements.forEach((element) => {
		// 	const folder = gui.addFolder(element.name);

		// 	folder.add(element.object.rotation, 'x', -Math.PI * 2, Math.PI * 2, 0.1).name('Rotation X');
		// 	folder.add(element.object.rotation, 'y', -Math.PI * 2, Math.PI * 2, 0.1).name('Rotation Y');
		// 	folder.add(element.object.rotation, 'z', -Math.PI * 2, Math.PI * 2, 0.1).name('Rotation Z');

		// 	folder.add(element.object.position, 'x', -10, 10, 0.1).name('Position X');
		// 	folder.add(element.object.position, 'y', -10, 10, 0.1).name('Position Y');
		// 	folder.add(element.object.position, 'z', -10, 10, 0.1).name('Position Z');
		// });
	}

	setControls() {
		if (!this.options.controls) return;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	init() {
		this.setRenderer();

		this.setCameraPosition();
		this.setLight();

		this.setGui();
		this.setControls();
	}

	startAnimation() {
		return new Promise((res) => {
			this.init();

			this.ground = new Ground();
			this.gameElements.push(this.ground);

			this.addGameElements();

			gsap.to(this.camera.position, {
				duration: 3,
				y: -4.8,
				onComplete: res,
			});
		});
	}

	start() {}

	update() {
		this.gameElements.forEach((element: GameElement) => {
			element.update();
		});
	}

	render() {
		if (this.controls) this.controls.update();

		this.update();

		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.render.bind(this));
	}
}
