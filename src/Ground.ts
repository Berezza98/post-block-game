import { PlaneGeometry, Group, DoubleSide, MeshStandardMaterial, Mesh } from 'three';
import GameElement from './types/GameElement.inteface';
import { degToRad } from 'three/src/math/MathUtils';

export default class Ground implements GameElement {
	name = 'ground';

	width = 4;

	height = 8;

	segmentWidth = 0.4;

	segmentGeometry = new PlaneGeometry(this.segmentWidth, this.height);

	materialWhite = new MeshStandardMaterial({
		color: 0x4a4a4a,
		side: DoubleSide,
	});

	materialBlack = new MeshStandardMaterial({
		color: 0xbdbdbd,
		side: DoubleSide,
	});

	borderMaterial = new MeshStandardMaterial({
		color: 0x737373,
		side: DoubleSide,
	});

	object = new Group();

	constructor() {
		this.addGroundComponents();
		this.addBorders();

		this.object.receiveShadow = true;
		// ground will be static(for better performance)
		this.object.matrixAutoUpdate = false;
	}

	get rotation() {
		return this.object.rotation;
	}

	addBorders() {
		const leftBorder = new Mesh(this.segmentGeometry, this.borderMaterial);
		const rightBorder = new Mesh(this.segmentGeometry, this.borderMaterial);
		const frontBorder = new Mesh(
			new PlaneGeometry(this.width, this.segmentWidth),
			this.borderMaterial,
		);

		leftBorder.rotateY(degToRad(90));
		leftBorder.position.set(-this.width / 2, 0, this.segmentWidth / 2);

		rightBorder.rotateY(degToRad(90));
		rightBorder.position.set(this.width / 2, 0, this.segmentWidth / 2);

		frontBorder.rotateX(degToRad(90));
		frontBorder.position.set(0, this.height / 2, this.segmentWidth / 2);

		this.object.add(leftBorder, rightBorder, frontBorder);
	}

	addGroundComponents() {
		for (let i = 0; i < this.width / this.segmentWidth; i++) {
			const stripe = new Mesh(
				this.segmentGeometry,
				i % 2 === 0 ? this.materialBlack : this.materialWhite,
			);
			stripe.position.set(-this.width / 2 + i * this.segmentWidth + this.segmentWidth / 2, 0, 0);
			this.object.add(stripe);
		}
	}

	update() {}
}
