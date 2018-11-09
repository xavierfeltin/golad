import {
    Engine, Scene, Light,
    Vector3, HemisphericLight,
    FreeCamera, Texture,
    Animation, Mesh, AbstractMesh
} from 'babylonjs';


const ANIM_FRAMERATE = 10;

import {Cell} from '../models/cell.model';
import { GameLogic } from './logic';
import { BoardStateModel } from '../state/board.state';

export class Game {
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: FreeCamera;
    private light: Light;
    private boardSize: number = 20;
    private picker: Mesh;
    private lastPlayerRendered: string = '';

    public static EMPTY: number = 0;
    public static BLUE_LIVING: number = 1;
    public static BLUE_BORN: number = 2;
    public static BLUE_DYING: number = 3;
    public static RED_LIVING: number = 4;
    public static RED_BORN: number = 5;
    public static RED_DYING: number = 6;
    public static NEW_BLUE_CELL: number = 7;
    public static NEW_BLUE_CELL_DYING: number = 8;
    public static NEW_RED_CELL: number = 9;
    public static NEW_RED_CELL_DYING: number = 10;
    public static HALF_BLUE_CELL: number = 11;
    public static HALF_BLUE_CELL_DYING: number = 12;
    public static HALF_RED_CELL: number = 13;
    public static HALF_RED_CELL_DYING: number = 14;

    public static INIT_BLUE_POSITION = new BABYLON.Vector3(150.0, 10.0, -199.0);
    public static INIT_RED_POSITION =  new BABYLON.Vector3(50.0, 10.0, -199.0);
    
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
        this.createPicker();
        //this.displayBoardMultiMap();
    }
    
    async createBoard(board: BoardStateModel) {
        this.resetBoard();

        this.boardSize = board.size;
        this.configureCamera();
        this.displayBoardMultiMap();
        
        //const meshBoard = this.scene.getMeshByName('board');
        //this.updateCellsRendering(board.cells, meshBoard);

        //Note: when transitionMaterials animation is called the first time, the 
        //animation does not play. It is called here the first time when initiating the board
        //to be sure it will work normally during the game.
        let meshBoard = this.scene.getMeshByName('board');
        let copyMeshBoard = meshBoard.clone('copyBoard', meshBoard.parent, true);
        copyMeshBoard.position.y = 9;        
        this.updateCellsRendering(board.cells, copyMeshBoard);
        await this.transitionMaterials(meshBoard);
        copyMeshBoard.position.y = 10;
        this.scene.removeMesh(meshBoard, true);
        copyMeshBoard.name='board';
    }

    resetBoard() {
        const meshBoard = this.scene.getMeshByName('board');
        if (meshBoard) {
            this.scene.removeMesh(meshBoard, true);
            this.scene.stopAllAnimations();
            this.setPickerPosition(new BABYLON.Vector3(150.0, 10.0, -190.0)); //initial blue position
            this.setPickerVisibility(false);
        }
    }

    //Picker used by IA player to show which cell it selected
    createPicker() {
        this.picker = BABYLON.MeshBuilder.CreateSphere("picker", {diameter: 2, diameterX: 3}, this.scene);
        this.picker.position = new BABYLON.Vector3(100.0, 10.0, -199.0);
        this.picker.isVisible = false;
        let whiteMat = new BABYLON.StandardMaterial("whiteMat", this.scene);
	    whiteMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        this.picker.material = whiteMat;
    }

    configureCamera() {
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
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_blue_empty_dying_cell.jpg', 'NewBlueCellDying'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_red_empty_cell.jpg', 'NewRedCell'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_red_empty_dying_cell.jpg', 'NewRedCellDying'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_blue_cell.jpg', 'BlueHalfCell'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_blue_dying_cell.jpg', 'BlueHalfCellDying'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_red_cell.jpg', 'RedHalfCell'));
        multimat.subMaterials.push(this.generateMaterialFromTexture('half_red_dying_cell.jpg', 'RedHalfCellDying'));

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

    //Start updating the board by moving the IA picker to the selected cell
    async updateBoard(board: BoardStateModel) {
        let target = BABYLON.Vector3.Zero();
        let initialPos = BABYLON.Vector3.Zero();

        if (board.lastMove != null) {
            const player = board.lastMove.player;            

            if (!player.human) {                              
                initialPos = player.name == 'Blue' ? Game.INIT_BLUE_POSITION : Game.INIT_RED_POSITION;

                //Reset picker position when changing player
                if (this.lastPlayerRendered !== player.name) {                    
                    this.setPickerVisibility(false);
                    this.setPickerPosition(initialPos);
                }

                //Move picker from current position to target
                this.setPickerVisibility(true);                                
                const pickedId = board.lastMove.pickedCell.id;
                const coordinate = GameLogic.getMatrixPositionFromId(pickedId, this.BOARD_SIZE);
                const x = 200.0 - (coordinate[1] * this.CELL_SIZE) - this.CELL_SIZE/2.0;
                const y = 10.0;
                const z = -200.0 + (coordinate[0] * this.CELL_SIZE ) + this.CELL_SIZE/2.0;
                target = new BABYLON.Vector3(x, y, z);
                await this.movePickerMesh(this.getPicker().position, target);                
            }
            else {
                this.setPickerVisibility(false);            
            }
        }     
    }

    //End updating the board by changing the materials and moving the IA picker to its original place if needed
    async endUpdateBoard(board: BoardStateModel) {
        let meshBoard = this.scene.getMeshByName('board');
        let target = BABYLON.Vector3.Zero();        
                  
        //Apply transition animation when applying life
        //No transition when player is picking a cell
        if (board.lastMove == null) {
            let copyMeshBoard = meshBoard.clone('copyBoard', meshBoard.parent, true);
            copyMeshBoard.position.y = 9;        
            this.updateCellsRendering(board.cells, copyMeshBoard);
            await this.transitionMaterials(meshBoard);            
            copyMeshBoard.position.y = 10;            
            this.scene.removeMesh(meshBoard, true);
            copyMeshBoard.name = 'board';        
        }
        else {
            this.updateCellsRendering(board.cells, meshBoard);
        }
                
        if (board.lastMove != null) {
            const player = board.lastMove.player;            

            if (!player.human) {                             
                if (board.lastMove.remainingActions == 0) {           
                    //Move picker from current position to target
                    target = player.name == 'Blue' ? Game.INIT_BLUE_POSITION : Game.INIT_RED_POSITION;
                    await this.movePickerMesh(this.getPicker().position, target);      
                    this.setPickerVisibility(false);                                
                }                
            }
            this.lastPlayerRendered = board.lastMove.player.name;
        }                 
    }
    
    //Display the right material depending of the cell state
    updateCellsRendering(cells: Cell[], meshBoard: AbstractMesh) {
        for(const cell of cells) {
            switch(cell.state) {
                case(GameLogic.BORN): {
                    meshBoard.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.BLUE_BORN : Game.RED_BORN; 
                    break;}
                case(GameLogic.DYING): {
                    meshBoard.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.BLUE_DYING : Game.RED_DYING; 
                    break;}
                case(GameLogic.LIVING): {
                    meshBoard.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.BLUE_LIVING : Game.RED_LIVING; 
                    break;}
                case(GameLogic.NEW_CELL): {
                    meshBoard.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.NEW_BLUE_CELL : Game.NEW_RED_CELL; 
                    break;}     
                case(GameLogic.NEW_CELL_DYING): {
                    meshBoard.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.NEW_BLUE_CELL_DYING : Game.NEW_RED_CELL_DYING; 
                    break;}                             
                case(GameLogic.HALF_CELL): {
                    meshBoard.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.HALF_BLUE_CELL : Game.HALF_RED_CELL;
                    break;}     
                case(GameLogic.HALF_CELL_DYING): {
                    meshBoard.subMeshes[cell.id].materialIndex = (cell.player == GameLogic.BLUE_PLAYER) ? Game.HALF_BLUE_CELL_DYING : Game.HALF_RED_CELL_DYING;
                    break;}                       
                default: {
                    meshBoard.subMeshes[cell.id].materialIndex = GameLogic.EMPTY; 
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

    translateAnim(): Animation {
        return new Animation(
          'pickerTranslate',
          'position',
          ANIM_FRAMERATE,
          Animation.ANIMATIONTYPE_VECTOR3,
          Animation.ANIMATIONLOOPMODE_CONSTANT,
        );
    }

    movePickerMesh(initial: Vector3, position: Vector3): Promise<any> {
        const picker = this.getPicker();
        const trAnim = this.translateAnim();

        const distance = this.computeEuclidianDistance(initial, position);
        const speed = 10;
        const lastFrame = Math.max(Math.ceil(distance/speed),1);
        
        trAnim.setKeys([
          {frame: 0, value: picker.position},
          {frame: lastFrame, value: position},
        ]);

        return Promise.all([
            this.scene.beginDirectAnimation(picker, [trAnim], 0, 20, false).waitAsync(),            
        ]);
    }

    computeEuclidianDistance(p1: Vector3, p2: Vector3): number {
        return Math.sqrt((p1.x - p2.x)**2 + (p1.z - p2.z)**2)
    }

    getPicker(): AbstractMesh {
        return this.scene.getMeshByName('picker');
    }

    setPickerVisibility(isVisible: boolean) {
        let picker = this.getPicker();
        picker.isVisible = isVisible;
    }

    setPickerPosition(pos: BABYLON.Vector3) {
        let picker = this.getPicker();
        picker.position = pos;
    }

    //Associate Game Logic information and 3D Game data
    matchGameAndLogic(material: number): number[] {
        const redCells = [Game.RED_LIVING, Game.RED_DYING, Game.NEW_RED_CELL, Game.HALF_RED_CELL, Game.RED_BORN];
        const blueCells = [Game.BLUE_LIVING, Game.BLUE_DYING, Game.NEW_BLUE_CELL, Game.HALF_BLUE_CELL, Game.BLUE_BORN];
        let player = GameLogic.NO_PLAYER;
        let state = GameLogic.EMPTY;

        if(redCells.includes(material)) {
          player = GameLogic.RED_PLAYER;
          if (material == Game.RED_LIVING) {state = GameLogic.LIVING;}
          else if (material == Game.RED_DYING) {state = GameLogic.DYING;}
          else if (material == Game.NEW_RED_CELL) {state = GameLogic.NEW_CELL;}
          else if (material == Game.RED_BORN) {state = GameLogic.BORN;}
          else {material = GameLogic.HALF_CELL;}
        }
        else if (blueCells.includes(material)) {
          player = GameLogic.BLUE_PLAYER;
          if (material == Game.BLUE_LIVING) {state = GameLogic.LIVING;}
          else if (material == Game.BLUE_DYING) {state = GameLogic.DYING;}
          else if (material == Game.NEW_BLUE_CELL) {state = GameLogic.NEW_CELL;}
          else if (material == Game.BLUE_BORN) {state = GameLogic.BORN;}
          else {material = GameLogic.HALF_CELL;}
        }

        return [state, player];
    }

    transitionMaterials(board: AbstractMesh): Promise<any> {        
        return Promise.all([
            BABYLON.Animation.CreateAndStartAnimation(
                'disappearBoard', // anim name
                board, // animated mesh
                'visibility', // animated property
                100, // speed
                50, // total frames
                1.0, // starting value
                0.0, // target value
                0  // cycle mode
            ).waitAsync()
        ]);                
    }

    //Main 3D rendering loop
    run(): void {
        // Rendering loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}