import {
    Engine, Scene, Light,
    Vector3, HemisphericLight,
    FreeCamera, Texture
} from 'babylonjs';
import {Cell} from '../models/cell.model';
import { GameLogic } from './logic';

export class Game {
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: FreeCamera;
    private light: Light;
    private boardSize: number = 20;

    public static EMPTY: number = 0;
    public static BLUE_LIVING: number = 1;
    public static BLUE_BORN: number = 2;
    public static BLUE_DYING: number = 3;
    public static RED_LIVING: number = 4;
    public static RED_BORN: number = 5;
    public static RED_DYING: number = 6;
    public static NEW_BLUE_CELL: number = 7;
    public static NEW_RED_CELL: number = 8;
    public static HALF_BLUE_CELL: number = 9;
    public static HALF_RED_CELL: number = 10;
    
    CELL_SIZE = 10.0;
    BOARD_SIZE = 20; //replace later with player board selection

    constructor(canvasElement: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this.canvas.height = 500;
        this.canvas.width = 500;
     
        // Attach the engine with the canvas
        this.engine = new Engine(this.canvas, true, {stencil: true}, true);
        
        //In case of redimensioning the browser's window
        window.addEventListener('resize', () => {
            this.engine.resize();
        });        
    }
    
    createScene(): void {
        // Create the scene attachached to the engine
        this.scene = new Scene(this.engine);
        
        // Create a global light
        this.light = new HemisphericLight('skyLight', new Vector3(0, -1, 0), this.scene);        

        this.configureCamera();
        //this.displayBoardMultiMap();
    }
    
    createBoard(size: number) {
        const board = this.scene.getMeshByName('board');
        if (board) {
            this.scene.removeMesh(board, true);
        }
        this.boardSize = size;
        this.configureCamera();
        this.displayBoardMultiMap();
    }

    configureCamera() {
        // Create the camera
        const sizeBoard = this.boardSize * this.CELL_SIZE;
        const halfSizeBoard = sizeBoard/2.0;
        this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(halfSizeBoard, this.BOARD_SIZE, -halfSizeBoard), this.scene);
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;        
        this.camera.orthoTop = halfSizeBoard;
        this.camera.orthoBottom = -halfSizeBoard;
        this.camera.orthoLeft = -halfSizeBoard;
        this.camera.orthoRight = halfSizeBoard;        
        this.camera.lockedTarget = new BABYLON.Vector3(halfSizeBoard, 0.0, -halfSizeBoard); //change later to authorize zoom in/out and view drag
        this.camera.attachControl(this.canvas, false);
    }

    displayBoardMultiMap() {
        const subdivisions = {'w': this.BOARD_SIZE, 'h': this.BOARD_SIZE};
        const precision = {'w': 1, 'h': 1};        
        const sizeBoard = this.BOARD_SIZE * this.CELL_SIZE;
        let tiledGround = BABYLON.Mesh.CreateTiledGround('board', 0.0, 0.0, sizeBoard, -sizeBoard, subdivisions, precision, this.scene);        
        tiledGround.position.y = 0.0;
        tiledGround.isPickable = true;
        
        tiledGround.rotation = new BABYLON.Vector3(0.0, 0.0, 0.0);        
        tiledGround.setPivotPoint(new BABYLON.Vector3(sizeBoard/2.0, 0.0, -sizeBoard/2.0));
        tiledGround.rotation = new BABYLON.Vector3(Math.PI, -Math.PI/2.0, 0.0);
                            
        var multimat = new BABYLON.MultiMaterial("multi", this.scene);
        multimat.subMaterials.push(this.generateMaterialFromTexture('empty_cell.jpg', 'Empty'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('blue_alive_cell.jpg', 'BlueAlive'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('blue_born_cell.jpg', 'BlueBorn'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('blue_dying_cell.jpg', 'BlueDying'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('red_alive_cell.jpg', 'RedAlive'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('red_born_cell.jpg', 'RedBorn'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('red_dying_cell.jpg', 'RedDying'));       
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_blue_empty_cell.jpg', 'NewBlueCell'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_red_empty_cell.jpg', 'NewRedCell'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_blue_cell.jpg', 'BlueHalfCell'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_red_cell.jpg', 'RedHalfCell'));

        tiledGround.material = multimat;
        
        var verticesCount = tiledGround.getTotalVertices();
        var tileIndicesLength = tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);        
        
        tiledGround.subMeshes = [];
        var base = 0;
        
        let i = 0;
        for (let col = 0; col < subdivisions.w; col++) {
            for (let row = 0; row < subdivisions.h; row++) {
                const subMesh = new BABYLON.SubMesh(GameLogic.EMPTY, 0, verticesCount, base, tileIndicesLength, tiledGround);
                base += tileIndicesLength;
                i++;
            }
        }            
    }

    updateBoard(cells: Cell[]) {
        const board = this.scene.getMeshByName('board');
        for(const cell of cells) {
            switch(cell.state) {
                case(GameLogic.BORN): {
                    board.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.BLUE_BORN : Game.RED_BORN; 
                    break;}
                case(GameLogic.DYING): {
                    board.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.BLUE_DYING : Game.RED_DYING; 
                    break;}
                case(GameLogic.LIVING): {
                    board.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.BLUE_LIVING : Game.RED_LIVING; 
                    break;}
                case(GameLogic.NEW_CELL): {
                    board.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.NEW_BLUE_CELL : Game.NEW_RED_CELL; 
                    break;}         
                case(GameLogic.HALF_CELL): {
                    board.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.HALF_BLUE_CELL : Game.HALF_RED_CELL;
                    break;}                   
                default: {
                    board.subMeshes[cell.id].materialIndex = GameLogic.EMPTY; 
                    break;}
            }            
        }
    }

    generateMaterialFromTexture(textureName, materialName) {
        const fixedTexture = new Texture('assets/' + textureName, this.scene);
        const material = new BABYLON.StandardMaterial(materialName, this.scene);
        material.diffuseTexture = fixedTexture;
        material.backFaceCulling = false;
        return material;
    }
    
    onClickEvent(x: number, y: number) {
        const pickResult = this.scene.pick(x,y);
        return pickResult;
    }

    getScene() {
        return this.scene;
    }

    run(): void {
        // Rendering loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}