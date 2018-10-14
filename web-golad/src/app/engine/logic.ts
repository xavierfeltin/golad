import { Cell } from '../models/cell.model';
import { ModelShape } from 'babylonjs';
import { Game } from './game';

export class GameLogic {
    
    public static EMPTY: number = 0;
    public static LIVING: number = 1;
    public static BORN: number = 2;
    public static DYING: number = 3;

    public static RED_PLAYER: number = 1;
    public static BLUE_PLAYER: number = 0;
    public static NO_PLAYER: number = -1;

    public static NB_NEIGHBORS_BORN: number = 3;
    public static NB_NEIGHBORS_LIVE: number = 2;

    public static MODE_ALL_NEIGHBORS = 0;
    public static MODE_PICKING = 1;
    public static MODE_APPLY_LIFE = 2;

    //PUBLIC LOGIC FUNCTIONS
    public static isLivingCell(cell: Cell): boolean {
        return (cell.state == GameLogic.LIVING) || (cell.state == GameLogic.DYING); 
    }

    public static isSurvivingCell(cell: Cell): boolean {
        return cell.state == GameLogic.LIVING; 
    }

    public static isCellConfortable(cell: Cell, board: Cell[], boardSize: number, mode: number): boolean {
        const neighbors = GameLogic.getNeighbors(cell, board, boardSize, mode);         
        return GameLogic.isLivingCell(cell) ? (neighbors.length == GameLogic.NB_NEIGHBORS_LIVE || neighbors.length == GameLogic.NB_NEIGHBORS_BORN)
            : (neighbors.length == GameLogic.NB_NEIGHBORS_BORN);
    }

    /**
     * Return the number of cells living or dying around the current cell
     * @param id id of current cell
     * @param board board game containing all the cells     
     */
    public static getNeighbors(cell: Cell, board: Cell[], boardSize: number, mode: number): Cell[] {
        const coord = GameLogic.getMatrixPositionFromId(cell.id, boardSize);        
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
                        
                        switch(mode) {
                            case GameLogic.MODE_APPLY_LIFE: {
                                if(GameLogic.isLivingCell(board[idNeighbor])) {                  
                                    neighbors.push(board[idNeighbor]);                 
                                }
                                break;    
                            }
                            case GameLogic.MODE_PICKING: {
                                if(GameLogic.isLivingCell(board[idNeighbor])) {                  
                                    neighbors.push(board[idNeighbor]);                 
                                }
                                break;
                            }
                            default: {
                                neighbors.push(board[idNeighbor]); break
                            }
                        }
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

    public static evolveDyingCells(cells: Cell[]): Cell[] {
        let updCells = [...cells];
        for(const cell of updCells) {
            cell.player = GameLogic.NO_PLAYER;
            cell.state = GameLogic.EMPTY;
        }
        return updCells;
    }

    public static evolveBornCells(cells: Cell[], board: Cell[], size: number): Cell[] {
        let updCells = [...cells];
        for(const cell of updCells) {      
            cell.state = GameLogic.LIVING; //will be living, player is already decided
            if (GameLogic.isCellConfortable(cell, board, size, GameLogic.MODE_APPLY_LIFE)) {
                cell.state = GameLogic.LIVING;
            }      
            else {
                cell.state = GameLogic.DYING;
            }
        }
        return updCells;
    }

    public static evolveLivingCells(cells: Cell[], board: Cell[], size): Cell[] {
        let updCells = [...cells];
        for(const cell of updCells) {       
            if (!GameLogic.isCellConfortable(cell, board, size, GameLogic.MODE_APPLY_LIFE)) {
                cell.state = GameLogic.DYING;
            }            
        }
        return updCells;
    }

    public static evolveEmptyCells(cells: Cell[], board: Cell[], size): Cell[] {
        let updCells = [...cells];
        for(const cell of updCells) {       
            if (GameLogic.isCellConfortable(cell, board, size, GameLogic.MODE_APPLY_LIFE)) {
                cell.player = GameLogic.defineBornCellPlayer(cell, board, size);
                cell.state = GameLogic.BORN;
            }            
        }
        return updCells;
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

    public static updatePickedCell(cell: Cell, player: number, board: Cell[], size: number) {
        let updCell: Cell = {
            id: cell.id,
            state: cell.state,
            player: cell.player
        };

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
        else {
            updCell.player = player;
            if (GameLogic.isCellConfortable(updCell, board, size, GameLogic.MODE_PICKING)) {
                updCell.state = GameLogic.LIVING;
            }
            else {
                updCell.state = GameLogic.DYING;
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

        let updatedNeighbors = [...neighbors];

        for(const updCell of updatedNeighbors) {
            if (GameLogic.isCellConfortable(updCell, board, size, GameLogic.MODE_PICKING)) {
                if (updCell.state == GameLogic.EMPTY) {
                    updCell.player = GameLogic.defineBornCellPlayer(updCell, board, size);
                    updCell.state = GameLogic.BORN;
                }
                else if (GameLogic.isLivingCell(updCell)) {
                    updCell.state = GameLogic.LIVING;
                }
                //else cell is in born state, should not happening 
            }  
            else {
                if(GameLogic.isLivingCell(updCell)) {
                    updCell.state = GameLogic.DYING;
                }
                else {
                    updCell.player = GameLogic.NO_PLAYER;
                    updCell.state = GameLogic.EMPTY;
                }
            }
        }

        return updatedNeighbors;
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

    public static getDefaultBoard(size: number): Cell[] {
        const boardSize = 20 * 20;
        let cells = [];
        for (let i = 0; i < boardSize; i++) {
            const cell: Cell = {
                id: i,
                player: GameLogic.NO_PLAYER,
                state: GameLogic.EMPTY
            }
            cells.push(cell);  
        }

        const blueIdCells = [42, 43, 62, 63, 322, 323, 342, 343];
        const redIdCells = [56, 57, 76, 77, 336, 337, 356, 357];
        
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
}