import {
    Engine, Scene, Light,
    Vector3, HemisphericLight, MeshBuilder,
    ArcRotateCamera, StandardMaterial, Texture,
    Color3
} from 'babylonjs';
    
export class Game {
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: ArcRotateCamera;
    private light: Light;
    
    constructor(canvasElement: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
    
        // Attach the engine with the canvas
        this.engine = new Engine(this.canvas, true);
    
        //In case of redimensioning the browser's window
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    createScene(): void {
        // Create the scene attachached to the engine
        this.scene = new Scene(this.engine);
    
        // Create the camera
        this.camera = new ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 5, Vector3.Zero(), this.scene);
        this.camera.position = new Vector3(0, 0, 0);
        this.camera.attachControl(this.canvas, false);
    
        // Create a global light
        this.light = new HemisphericLight('skyLight', new Vector3(1, 1, 0), this.scene);
    
        // Add a sphere inside the scene
        const sphere = MeshBuilder.CreateSphere('sphere', { segments: 16, diameter: 1 }, this.scene);
        sphere.position.y = 1;
        
        const subdivisions = {'w': 20, 'h': 20};
        const precision = {'w': 1, 'h': 1};
        const options = {
            'xmin': 0.0,
            'xmax': 200.0,
            'zmin': 0.0,
            'zmax': 200.0,
            'subdivisions': subdivisions,
            'precision': precision,
            'updtable': true
        }        
        let tiledGround = MeshBuilder.CreateTiledGround('board', options, this.scene);
        
        // Create materials for the board
        const redMaterial = new BABYLON.StandardMaterial("Red", this.scene);
        redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        
        const blueMaterial = new BABYLON.StandardMaterial("Blue", this.scene);
        blueMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);

        const blackMaterial = new BABYLON.StandardMaterial("Black", this.scene);
        blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

        var multimat = new BABYLON.MultiMaterial("multi", this.scene);
        multimat.subMaterials.push(redMaterial);
        multimat.subMaterials.push(blackMaterial);
        multimat.subMaterials.push(blueMaterial);

        // Apply the mutlimaterial
        tiledGround.material = multimat;
        const verticesCount = tiledGround.getTotalVertices();
        const tileIndicesLength = tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);

        tiledGround.subMeshes = [];
        var base = 0;
        for (var row = 0; row < subdivisions.h; row++) {
            for (var col = 0; col < subdivisions.w; col++) {
                tiledGround.subMeshes.push(new BABYLON.SubMesh(row%2 ^ col%2, 0, verticesCount, base, tileIndicesLength, tiledGround));
                base += tileIndicesLength;
            }
        }

        // Add a skybox for the environment
        const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, this.scene);
        const skyboxMaterial = new StandardMaterial('skyBox', this.scene);
        skyboxMaterial.backFaceCulling = false;
    
        // Create the texture for the environment
        const fixedTexture = new Texture('/assets/saint_jean_luz.jpg', this.scene);
        skyboxMaterial.reflectionTexture = fixedTexture; // videoTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.FIXED_EQUIRECTANGULAR_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }
    
    run(): void {
        // Rendering loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}