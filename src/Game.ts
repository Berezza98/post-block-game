import {
	AmbientLight,
	CameraHelper,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
} from 'three';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Ground from './Ground';
import Player, { PLAYER_EVENTS } from './Player';
import EnemyPool from './EnemyPool';
import { mapLinear } from 'three/src/math/MathUtils';
import IUpdatable from './types/Updatable.interface';
import { DYNAMIC_OBJECT_EVENTS } from './DynamicObject';

interface GameOptions {
	gui?: boolean;
	controls?: boolean;
}

export default class Game {
	scene = new Scene();

	renderer = new WebGLRenderer({ alpha: true });

	options: GameOptions;

	controls?: OrbitControls;

	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	light: DirectionalLight;

	gameElements: IUpdatable[] = [];

	ground: Ground;

	player: Player;

	stopped: boolean;

	constructor(options: GameOptions) {
		this.options = options;
	}

	private setRenderer() {
		this.renderer.shadowMap.enabled = true;

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	}

	private createGameElements() {
		const enemyPool = new EnemyPool(this.ground, this.scene);
		this.player = new Player(this.scene, this.ground, enemyPool);

		this.gameElements.push(enemyPool, this.player);

		this.player.render();
	}

	private cameraPositionHandler() {
		this.player.on(DYNAMIC_OBJECT_EVENTS.POSITION_X_CHANGED, (position: Vector3) => {
			const newCameraPositionX = mapLinear(position.x, this.player.minX, this.player.maxX, -1, 1);
			this.camera.position.setX(newCameraPositionX);
		});
	}

	private setInitialCameraPosition() {
		this.camera.position.set(0, -6, 1.1);
		this.camera.rotation.set(1.3, 0, 0);
	}

	private setLight() {
		this.light = new DirectionalLight(0xffffff, 1);
		this.light.position.y = 3;
		this.light.position.x = 1;
		this.light.position.z = 2;
		this.light.castShadow = true;

		this.scene.add(this.light);
		this.scene.add(new AmbientLight(0xffffff, 0.5));
	}

	private setGui() {
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

	private setControls() {
		if (!this.options.controls) return;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	private init() {
		this.setRenderer();

		this.setInitialCameraPosition();
		this.setLight();

		this.setGui();
		this.setControls();
	}

	private startAnimation() {
		return new Promise((res) => {
			this.init();

			this.ground = new Ground(this.scene);
			this.ground.render();

			gsap.to(this.camera.position, {
				duration: 3,
				y: -4.8,
				onComplete: res,
			});
		});
	}

	start() {
		this.render();

		this.startAnimation().then(() => {
			this.createGameElements();
			this.cameraPositionHandler();

			this.player.on(PLAYER_EVENTS.PLAYER_COLLISION, this.stop.bind(this));
		});
	}

	private stop() {
		console.log('stop');
		this.stopped = true;
	}

	private update() {
		this.gameElements.forEach((element: IUpdatable) => {
			element.update();
		});
	}

	private render() {
		if (this.stopped) return;

		if (this.controls) this.controls.update();

		this.update();
		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.render.bind(this));
	}
}
