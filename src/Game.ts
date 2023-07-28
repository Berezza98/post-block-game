import {
	AmbientLight,
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
import { Enemies } from './Enemies';
import { mapLinear } from 'three/src/math/MathUtils';
import IUpdatable from './types/Updatable.interface';
import { DYNAMIC_OBJECT_EVENTS } from './core/DynamicObject';
import { Perks } from './Perks';
import { Joystick } from './Joystick';
import { isMobile } from './helpers/isMobile';
import { JumpButton } from './JumpButton';
import { Score } from './Score';
import Background from './Background';
import { UpdateStructure } from './core/UpdateStructure';

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

	gameElements = new UpdateStructure();

	ground: Ground;

	player: Player;

	stopped: boolean;

	joystick?: Joystick;

	jumpButton?: JumpButton;

	background = new Background();

	score = new Score();

	constructor(options: GameOptions) {
		this.options = options;
	}

	private setRenderer() {
		this.renderer.shadowMap.enabled = true;

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	}

	private createGameElements() {
		const enemies = new Enemies(this.ground, this.scene);
		const perks = new Perks(this.ground, this.scene);
		this.player = new Player({
			scene: this.scene,
			ground: this.ground,
			joystick: this.joystick,
			jumpButton: this.jumpButton,
			score: this.score,
			enemies,
			perks,
		});

		this.gameElements.add(enemies, perks, this.player);

		this.player.render();
	}

	private cameraPositionHandler() {
		this.player.addEventListener(DYNAMIC_OBJECT_EVENTS.POSITION_X_CHANGED, (event) => {
			const position: Vector3 = event.message;

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

	private setMobileControls() {
		if (!isMobile.any()) return;

		this.joystick = new Joystick({ className: 'joystick', size: 400, removeLastValue: true });
		this.jumpButton = new JumpButton({ className: 'jump-btn', size: 400 });
		this.joystick.append(document.body);
		this.jumpButton.append(document.body);
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

		this.setMobileControls();

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
		this.background.start();
		this.render();

		this.startAnimation().then(() => {
			this.jumpButton?.show();
			this.joystick?.show();

			this.score.render();
			this.createGameElements();
			this.cameraPositionHandler();

			this.player.addEventListener(PLAYER_EVENTS.PLAYER_COLLISION, this.stop.bind(this));
		});
	}

	private stop() {
		console.log('stop');
		this.stopped = true;
	}

	private update() {
		this.gameElements.update();
	}

	private render() {
		if (this.stopped) return;

		if (this.controls) this.controls.update();

		this.update();
		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.render.bind(this));
	}
}
