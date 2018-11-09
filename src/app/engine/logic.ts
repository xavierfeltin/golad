import { Cell, FactoryCell } from '../models/cell.model';
import { FactoryBoardCells } from '../models/board.model';

export class GameLogic {
    
    public static EMPTY: number = 0;
    public static LIVING: number = 1;
    public static BORN: number = 2;
    public static DYING: number = 3;
    public static NEW_CELL: number = 4;
    public static NEW_CELL_DYING: number = 5;
    public static HALF_CELL: number = 6;
    public static HALF_CELL_DYING: number = 7;

    public static BLUE_PLAYER: number = 0;
    public static RED_PLAYER: number = 1;    
    public static NO_PLAYER: number = -1;

    public static NB_NEIGHBORS_BORN: number = 3;
    public static NB_NEIGHBORS_LIVE: number = 2;

    public static MODE_ALL_NEIGHBORS = 0;
    public static MODE_PICKING = 1;
    public static MODE_APPLY_LIFE = 2;

    public static HUMAN = 'human';
    public static IA = 'ia';

    //PUBLIC LOGIC FUNCTIONS
    public static isLivingCell(cell: Cell): boolean {
        return (cell.state == GameLogic.LIVING) || (cell.state == GameLogic.DYING); 
    }

    public static isSurvivingCell(cell: Cell): boolean {
        return cell.state == GameLogic.LIVING; 
    }

    public static isCellConfortable(cell: Cell, board: Cell[], boardSize: number, mode: number): boolean {
        const neighbors = GameLogic.getNeighbors(cell, board, boardSize, mode);        
        
        if (GameLogic.isLivingCell(cell) ||this.isNewCell(cell) || this.isHalfCell(cell)) {
            return (neighbors.length == GameLogic.NB_NEIGHBORS_LIVE || neighbors.length == GameLogic.NB_NEIGHBORS_BORN)
        }
        else {
            return (neighbors.length == GameLogic.NB_NEIGHBORS_BORN);
        }
    }

    /**
     * Return the number of cells living or dying around the current cell
     * @param id id of current cell
     * @param board board game containing all the cells     
     */
    public static getNeighbors(cell: Cell, board: Cell[], boardSize: number, mode: number): Cell[] {
        let neighbors = [];
        for(const idNeighbor of cell.neighbors) {
            switch(mode) {
                case GameLogic.MODE_APPLY_LIFE: {
                    if(GameLogic.isLivingCell(board[idNeighbor]) 
                            || GameLogic.isNewCell(board[idNeighbor])
                            || GameLogic.isHalfCell(board[idNeighbor])) {                  
                        neighbors.push(board[idNeighbor]);                 
                    }
                    break;    
                }
                case GameLogic.MODE_PICKING: {
                    if(GameLogic.isLivingCell(board[idNeighbor])
                            || GameLogic.isNewCell(board[idNeighbor])
                            || GameLogic.isHalfCell(board[idNeighbor])) {            
                        neighbors.push(board[idNeighbor]);                 
                    }
                    break;
                }
                default: {
                    neighbors.push(board[idNeighbor]); break
                }
            }
        }

        return neighbors;
    }

    public static hasLivingCellAsNeighbor(cell: Cell, board: Cell[]) {
        const nbNeighbors = cell.neighbors.length;
        let i = 0;
        while(i < nbNeighbors && !GameLogic.isLivingCell(board[cell.neighbors[i]]))
        return i != (nbNeighbors-1);
    }

    public static getNeighborsIds(idCell: number, boardSize: number): number[] {
        const coord = GameLogic.getMatrixPositionFromId(idCell, boardSize);        
        const neighborIndexes = [-1, 0, 1]; 
        let neighbors = [];
        for(const i of neighborIndexes) {
            for(const j of neighborIndexes) {
                if (i != 0 || j != 0) { //not cell itself
                    const row = coord[0] + i;
                    const column = coord[1] + j;
                    const idNeighbor = GameLogic.getIdFromMatrixPosition(row, column, boardSize);
                    if (row >= 0 && row < boardSize
                            && column >= 0 && column < boardSize) {
                        neighbors.push(idNeighbor);
                    }
                }
            }
        }
        return neighbors;
    }

    public static getCellsByType(board: Cell[]): {} {
        let types = {};
        types[GameLogic.DYING] = [];
        types[GameLogic.BORN] = [];
        types[GameLogic.LIVING] = [];        
        types[GameLogic.EMPTY] = [];

        for (const cell of board) {
            switch(cell.state) {
                case(GameLogic.LIVING): {types[GameLogic.LIVING].push(cell);break;}
                case(GameLogic.DYING): {types[GameLogic.DYING].push(cell);break;}
                case(GameLogic.BORN): {types[GameLogic.BORN].push(cell);break;}
                default: {{types[GameLogic.EMPTY].push(cell);break;}}
            }
        }

        return types;
    }

    public static defineBornCellPlayer(cell, board, size) {
        const neighbors = GameLogic.getNeighbors(cell, board, size, GameLogic.MODE_APPLY_LIFE);        
        let redCount = 0;
        let blueCount = 0;
        for(const neighbor of neighbors) {
            if (GameLogic.isLivingCell(neighbor)) {
                if (neighbor.player == GameLogic.BLUE_PLAYER) {
                    blueCount ++;
                }
                else {
                    redCount++;
                }
            }
        }
        return (blueCount > redCount) ? GameLogic.BLUE_PLAYER : GameLogic.RED_PLAYER;        
    }

    public static isNewCell(cell: Cell) {
        return cell.state == GameLogic.NEW_CELL || cell.state == GameLogic.NEW_CELL_DYING;
    }

    public static isHalfCell(cell: Cell) {
        return cell.state == GameLogic.HALF_CELL || cell.state == GameLogic.HALF_CELL_DYING;
    }

    public static updatePickedCell(cell: Cell, player: number, board: Cell[], size: number) {
        let updCell = FactoryCell.copy(cell);

        // Manage state of new selected cell:
        // - If empty, create a new cell
        // - If alive/dying, delete the cell
        if(GameLogic.isLivingCell(cell)) {
            updCell.player = GameLogic.NO_PLAYER;
            updCell.state = GameLogic.EMPTY;
            
            if (GameLogic.isCellConfortable(updCell, board, size, GameLogic.MODE_PICKING)) {
                updCell.player = GameLogic.defineBornCellPlayer(cell, board, size);
                updCell.state = GameLogic.BORN;
            }
        }
        else if(GameLogic.isNewCell(cell)) {
            updCell.player = player;
            updCell.state = GameLogic.isCellConfortable(updCell, board, size, GameLogic.MODE_PICKING) ? 
                GameLogic.HALF_CELL : GameLogic.HALF_CELL_DYING;
        }
        else if(GameLogic.isHalfCell(cell)) {
            updCell.player = player;
            updCell.state = GameLogic.isCellConfortable(updCell, board, size, GameLogic.MODE_PICKING) ? 
                GameLogic.LIVING : GameLogic.DYING;
        }        
        else { //Empty cell, or to be born
            updCell.player = player;
            updCell.state = GameLogic.NEW_CELL_DYING;
            if (GameLogic.isCellConfortable(updCell, board, size, GameLogic.MODE_PICKING)) {
                updCell.state = GameLogic.NEW_CELL; 
            }
        }

        return updCell;
    }

    public static updatePickedNeighbors(neighbors: Cell[], board: Cell[], size: number) {
        // Update neighbors:
        // - If neighbor is empty and there are 3 neighbors, a new cell is born
        // - Else:
        //  if neighbor is supposed to be born, it disappear
        //  if neighbor is alive, it will die

        for(let updCell of neighbors) {
            const idCell = updCell.id;                        
            if (GameLogic.isCellConfortable(updCell, board, size, GameLogic.MODE_PICKING)) {

                if (updCell.state == GameLogic.EMPTY) {
                    board[idCell].player = GameLogic.defineBornCellPlayer(updCell, board, size);
                    board[idCell].state = GameLogic.BORN;                    
                }
                else if (GameLogic.isLivingCell(updCell)) {
                    board[idCell].state = GameLogic.LIVING;
                }
                else if (GameLogic.isNewCell(updCell)) {
                    board[idCell].state = GameLogic.NEW_CELL;
                }
                else if (GameLogic.isHalfCell(updCell)) {
                    board[idCell].state = GameLogic.HALF_CELL;
                }
                //else cell is in born state, should not happening 
            }  
            else {
                if(GameLogic.isLivingCell(updCell)) {
                    board[idCell].state = GameLogic.DYING;
                }
                else if (GameLogic.isNewCell(updCell)) {
                    board[idCell].state = GameLogic.NEW_CELL_DYING;
                }
                else if (GameLogic.isHalfCell(updCell)) {
                    board[idCell].state = GameLogic.HALF_CELL_DYING;
                }
                else {
                    board[idCell].player = GameLogic.NO_PLAYER;
                    board[idCell].state = GameLogic.EMPTY;
                }
            }
        }

        //return updatedNeighbors;
    }

    /**
     * Ids are generated from Top to Bottom and Left to Right
     * @param id id to convert
     * @return Array with two numbers representing [row, column] in a matrix space
     */
    public static getMatrixPositionFromId(id: number, boardSize: number) {
        return [id%boardSize, Math.floor(id/boardSize)];
    }

    /**
     * Match matrix coordinates into cells ids
     * @param row
     * @param colmn
     * @return id cell
     */
    public static getIdFromMatrixPosition(row: number, column:number, boardSize: number): number {
        return row + column * boardSize ;
    }

    //Generate a static board for test purposes
    public static getDefaultBoard(): Cell[] {
        const boardSize = 20 * 20;
        let cells = [];
        for (let i = 0; i < boardSize; i++) {
            const cell: Cell = {
                id: i,
                player: GameLogic.NO_PLAYER,
                state: GameLogic.EMPTY,
                neighbors: GameLogic.getNeighborsIds(i, 20)
            }
            cells.push(cell);  
        }

        //const blueIdCells = [42, 43, 62, 63, 322, 323, 342, 343];
        let blueIdCells = [42, 43, 44, 45, 46, 66, 86, 106, 126, 125, 124, 123, 122, 102, 82, 62];
        blueIdCells = blueIdCells.concat([262, 263, 264, 265, 266, 286, 306, 326, 346, 345, 344, 343, 342, 322, 302, 282]);

        let redIdCells = [53, 54, 55, 56, 57, 77, 97, 117, 137, 136, 135, 134, 133, 113, 93, 73];
        redIdCells = redIdCells.concat([273, 274, 275, 276, 277, 297, 317, 337, 357, 356, 355, 354, 353, 333, 313, 293]);
        
        for(const id of blueIdCells) {
            cells[id].state = GameLogic.LIVING;
            cells[id].player = GameLogic.BLUE_PLAYER;
        }

        for(const id of redIdCells) {
            cells[id].state = GameLogic.LIVING;
            cells[id].player = GameLogic.RED_PLAYER;
        }

        return cells;
    }

    //Generate a random board to start a new game
    public static getRandomBoard(): Cell[] {
        const boardSize = 20 * 20;
        const nbCells = 150;

        let cells = [];
        for (let i = 0; i < boardSize; i++) {
            const cell: Cell = {
                id: i,
                player: GameLogic.NO_PLAYER,
                state: GameLogic.EMPTY,
                neighbors: GameLogic.getNeighborsIds(i, 20)
            }
            cells.push(cell);  
        }

        let currentPlayer = GameLogic.BLUE_PLAYER;
        let availableCells = Array.from(new Array(boardSize),(val,index)=>index);
        for(let i = 0; i < nbCells; i++) {
            const rand = Math.floor(Math.random() * availableCells.length);
            const index = availableCells[rand];
            cells[index].state = GameLogic.isCellConfortable(cells[index], cells, 20, GameLogic.MODE_PICKING) ? GameLogic.LIVING : GameLogic.DYING; 
            cells[index].player = currentPlayer;
            
            const neighborsCells = GameLogic.getNeighbors(cells[index], cells, 20, GameLogic.MODE_ALL_NEIGHBORS);
            
            GameLogic.updatePickedNeighbors(neighborsCells, cells, 20);

            availableCells = availableCells.filter((val, j) => {return val != index});
            currentPlayer = (currentPlayer == GameLogic.BLUE_PLAYER) ? GameLogic.RED_PLAYER :GameLogic.BLUE_PLAYER;
        }

        return cells;
    }

    //Evolve the cells to the next generation
    public static applyLife(board: Cell[]): Cell[] {
        const boardSize = 20;
        let updatedBoard = FactoryBoardCells.copy(board);
        
        const cellsByType = GameLogic.getCellsByType(updatedBoard);
        GameLogic.evolveDyingCells(cellsByType[GameLogic.DYING], updatedBoard);
        
        const newCells = GameLogic.evolveBornCells(cellsByType[GameLogic.BORN], updatedBoard, boardSize);
        for (const c of newCells) {
            updatedBoard[c.id].state = c.state;
            updatedBoard[c.id].player = c.player;            
        }

        //let newLivingCells = newCells.filter((cell) => { return cell.state == GameLogic.LIVING});
        //let newDyingCells = newCells.filter((cell) => { return cell.state == GameLogic.DYING});

        const newUpdCells = GameLogic.evolveLivingCells(cellsByType[GameLogic.LIVING], updatedBoard, boardSize);
        //newLivingCells = newLivingCells.concat(newUpdCells.filter((cell) => { return cell.state == GameLogic.LIVING}));
        //newDyingCells = newDyingCells.concat(newUpdCells.filter((cell) => { return cell.state == GameLogic.DYING}));

        //for (const updCell of [...newLivingCells, ...newDyingCells]) {
        for (const c of newUpdCells) {
            updatedBoard[c.id].state = c.state;
            updatedBoard[c.id].player = c.player;            
        }

        GameLogic.evolveEmptyCells(cellsByType[GameLogic.EMPTY], updatedBoard, boardSize);

        return updatedBoard;
    }

    private static evolveDyingCells(cells: Cell[], board: Cell[]) {
        for(const cell of cells) {
            board[cell.id].player = GameLogic.NO_PLAYER;
            board[cell.id].state = GameLogic.EMPTY;
        }
    }

    private static evolveBornCells(cells: Cell[], board: Cell[], size: number): Cell[] {
        let updCells = FactoryBoardCells.copy(cells);
        for(const cell of updCells) {      
            cell.state = GameLogic.LIVING;
            if (!GameLogic.isCellConfortable(cell, board, size, GameLogic.MODE_APPLY_LIFE)) {
                cell.state = GameLogic.DYING;
            } 
        }
        return updCells;
    }

    private static evolveLivingCells(cells: Cell[], board: Cell[], size): Cell[] {
        let updCells = FactoryBoardCells.copy(cells);
        for(const cell of updCells) {       
            if (!GameLogic.isCellConfortable(cell, board, size, GameLogic.MODE_APPLY_LIFE)) {
                cell.state = GameLogic.DYING;
            }            
        }
        return updCells;
    }

    private static evolveEmptyCells(cells: Cell[], board: Cell[], size: number) {
        for(const cell of cells) {       
            if (GameLogic.isCellConfortable(cell, board, size, GameLogic.MODE_APPLY_LIFE)) {
                board[cell.id].player = GameLogic.defineBornCellPlayer(cell, board, size);
                board[cell.id].state = GameLogic.BORN;
            }            
        }
    }

    public static getScore(board: Cell[]): number[] {
        let scores = Array(2).fill(0);
        for(const cell of board) {
            if(GameLogic.isLivingCell(cell) || GameLogic.isHalfCell(cell) || GameLogic.isNewCell(cell)) {
                if(cell.player != GameLogic.NO_PLAYER) {scores[cell.player]++;}
            }
        }
        return scores;
    }
}