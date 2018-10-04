import {
    Engine, Scene, Light,
    Vector3, HemisphericLight, MeshBuilder,
    FreeCamera, StandardMaterial, Texture,
    Color3
} from 'babylonjs';
    
export class Game {
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: FreeCamera;
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
        //this.camera = new ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 5, Vector3.Zero(), this.scene);
        const sizeBoard = 20 * 1 + 20 * 0.1
        this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(sizeBoard/2.0, 20, sizeBoard/2.0), this.scene);
        this.camera.setTarget( new BABYLON.Vector3(sizeBoard/2.0, 0.0, sizeBoard/2.0));
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;        
        this.camera.orthoTop = 15.0;
        this.camera.orthoBottom = -15.0;
        this.camera.orthoLeft = 15.0;
        this.camera.orthoRight = -15.0;        
        this.camera.attachControl(this.canvas, false);
    
        // Create a global light
        this.light = new HemisphericLight('skyLight', new Vector3(1, 1, 0), this.scene);
    
        this.displayBoard();
        this.displayTiles();
    }
    
    displayBoard() {
        const name = 'board';
        const size = 250;
        const options = {
            'width': size,
            'depth': size,
            'height': 0.5
        } 
        const board = MeshBuilder.CreateBox(name, options, this.scene);
        board.position.x = -10.0;
        board.position.y = -1.0;
        board.position.z = -10.0;

        const blackMaterial = new BABYLON.StandardMaterial("DarkGrey", this.scene);
        blackMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        board.material = blackMaterial;
    }

    displayTiles() {
        const gap = 0.1;
        const start = {
            'x': 0.0,
            'y': 0.0,
            'z': 0.0
        };
        const subdivisions = 20;
        const size = 1.0;   
        const options = {
            'width': size,
            'depth': size,
            'height': 0.5
        }       
        
        let neighborX = null;
        let neighborZ = null;

        const darkGreyMaterial = new BABYLON.StandardMaterial("DarkGrey", this.scene);
        darkGreyMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);

        for(let i = 0; i < subdivisions; i++) {

            const name = 'tile_' + (i+1);
            const tile = MeshBuilder.CreateBox(name, options, this.scene);
            tile.material = darkGreyMaterial;

            if (neighborX) {
                tile.position.x = neighborX.position.x + gap + size;
                tile.position.y = neighborX.position.y;
                tile.position.z = neighborX.position.z;
            }
            else {
                tile.position.x = start.x;
                tile.position.y = start.y;
                tile.position.z = start.z;                
            }
            neighborX = tile;
            neighborZ = tile

            for(let j = 0; j < subdivisions-1; j++) {
                const name = 'tile_' + (i+1+(subdivisions*(j+1)));
                const tile = MeshBuilder.CreateBox(name, options, this.scene);
                tile.material = darkGreyMaterial;
                if (neighborZ) {
                    tile.position.x = neighborZ.position.x;
                    tile.position.y = neighborZ.position.y;
                    tile.position.z = neighborZ.position.z + gap + size;
                }
                neighborZ = tile;                                                                            
            }
        }        
    }

    run(): void {
        // Rendering loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}