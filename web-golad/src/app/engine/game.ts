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
                case(GameLogic.BLUE_BORN): {board.subMeshes[cell.id].materialIndex = GameLogic.BLUE_BORN; break;}
                case(GameLogic.BLUE_DYING): {board.subMeshes[cell.id].materialIndex = GameLogic.BLUE_DYING; break;}
                case(GameLogic.BLUE_LIVING): {board.subMeshes[cell.id].materialIndex = GameLogic.BLUE_LIVING; break;}
                case(GameLogic.RED_BORN): {board.subMeshes[cell.id].materialIndex = GameLogic.RED_BORN; break;}
                case(GameLogic.RED_DYING): {board.subMeshes[cell.id].materialIndex = GameLogic.RED_DYING; break;}
                case(GameLogic.RED_LIVING): {board.subMeshes[cell.id].materialIndex = GameLogic.RED_LIVING; break;}
                case(GameLogic.EMPTY): {board.subMeshes[cell.id].materialIndex = GameLogic.EMPTY; break;}
                default: {
                    board.subMeshes[cell.id].materialIndex = GameLogic.EMPTY; break;
                }
            }            
        }
    }

    generateMaterialFromTexture(textureName, materialName) {
        const fixedTexture = new Texture('/assets/' + textureName, this.scene);
        const material = new BABYLON.StandardMaterial(materialName, this.scene);
        material.diffuseTexture = fixedTexture;
        material.backFaceCulling = false;
        return material;
    }
    
    onClickEvent(x: number, y: number) {
        const pickResult = this.scene.pick(x,y);
        return pickResult;
    }

    /*
    renderPlayerCells(idPlayer: number, cells: number[]) {
        let board = this.scene.getMeshByName('board');
        for (const cell of cells) {
            let idMaterial = 0;
            const neighbors = this.getNeighbors(cell, board);
            if (GameLogic.isCellConfortable(neighbors)) {
                idMaterial = (idPlayer == GameLogic.RED_PLAYER) ? GameLogic.RED_LIVING : GameLogic.BLUE_LIVING;
            }
            else {
                idMaterial = (idPlayer == GameLogic.RED_PLAYER) ? GameLogic.RED_DYING : GameLogic.BLUE_DYING;
            }
            board.subMeshes[cell].materialIndex = idMaterial; 
        }
    }
    */

    /**
     * Return the number of cells living or dying around the current cell
     * @param id id of current cell
     * @param board board game containing all the cells
     */
    /*
    getNeighbors(id: number, board: BABYLON.AbstractMesh): number {
        const coord = this.getMatrixPositionFromId(id);
        const consideredCells = [GameLogic.BLUE_LIVING, GameLogic.RED_LIVING, GameLogic.BLUE_DYING, GameLogic.RED_DYING];
        const neighborIndexes = [-1, 0, 1]; 
        let neighbors = 0;
        for(const i of neighborIndexes) {
            for(const j of neighborIndexes) {
                if (i != 0 && j != 0) { //not cell itself
                    const row = coord[0] + i;
                    const column = coord[1] + j;
                    if (row >= 0 && row < this.BOARD_SIZE
                        && column >= 0 && column < this.BOARD_SIZE
                        && consideredCells.includes(board.subMeshes[this.getIdFromMatrixPosition(row, column)].materialIndex)) {
                        
                        neighbors ++;                 
                    }
                }
            }
        }
        return neighbors;
    }
    */

    /**
     * Ids are generated from Top to Bottom and Left to Right
     * @param id id to convert
     * @return Array with two numbers representing [row, column] in a matrix space
     */
    /*
    getMatrixPositionFromId(id: number) {
        return [id%this.BOARD_SIZE,Math.floor(id/this.BOARD_SIZE)];
    }
    */

    /**
     * Match matrix coordinates into cells ids
     * @param row
     * @param colmn
     * @return id cell
     */
    /*
    getIdFromMatrixPosition(row: number, column:number): number {
        return row + column * this.BOARD_SIZE ;
    }
    */

    getScene() {
        return this.scene;
    }

    run(): void {
        // Rendering loop
        this.engine.runRenderLoop(() => {
            //this.renderPlayerCells(Game.RED_PLAYER, [2, 5, 10, 11, 34]);
            //this.renderPlayerCells(Game.BLUE_PLAYER, [236, 256, 276, 257, 258, 259]);
            //this.engine.resize();
            this.scene.render();
        });
    }
}