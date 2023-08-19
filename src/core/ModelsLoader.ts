import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ILoadingModel {
	name: string;
	url: string;
}

class ModelsLoader {
	private loader = new GLTFLoader();

	private models: Record<string, GLTF> = {};

	private loadingModels: ILoadingModel[] = [];

	constructor() {}

	getModel(name: string) {
		if (!this.models[name]) return null;

		return this.models[name];
	}

	private async load(loadingModel: ILoadingModel): Promise<{ name: string; gltf: GLTF }> {
		return new Promise((res, rej) => {
			this.loader.load(
				loadingModel.url,
				(gltf) => {
					res({ name: loadingModel.name, gltf });
				},
				() => {},
				() => {
					rej();
				},
			);
		});
	}

	async loadAll(loadingModels: ILoadingModel[]) {
		this.loadingModels = loadingModels;

		const loadedModels = await Promise.all(
			this.loadingModels.map((modelToLoad) => this.load(modelToLoad)),
		);

		for (const model of loadedModels) {
			this.models[model.name] = model.gltf;
			console.log(model);
		}
	}
}

export const modelsLoader = new ModelsLoader();
