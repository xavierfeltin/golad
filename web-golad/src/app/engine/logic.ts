import { Cell } from '../models/cell.model';

export class GameLogic {
    
    public static EMPTY: number = 0;
    public static BLUE_LIVING: number = 1;
    public static BLUE_BORN: number = 2;
    public static BLUE_DYING: number = 3;
    public static RED_LIVING: number = 4;
    public static RED_BORN: number = 5;
    public static RED_DYING: number = 6;
    public static RED_PLAYER = 1;
    public static BLUE_PLAYER = 0;

    public static NB_NEIGHBORS = 3;

    //PUBLIC LOGIC FUNCTIONS

    public static isCellConfortable(id: number, board: Cell[], boardSize: number): boolean {        
        return GameLogic.getNeighbors(id, board, boardSize, false).length == GameLogic.NB_NEIGHBORS;
    }

    /**
     * Return the number of cells living or dying around the current cell
     * @param id id of current cell
     * @param board board game containing all the cells     
     */
    public static getNeighbors(id: number, board: Cell[], boardSize: number, isAllNeighbors: boolean): number[] {
        const coord = GameLogic.getMatrixPositionFromId(id, boardSize);        
        const consideredCells = isAllNeighbors ? [GameLogic.EMPTY, GameLogic.BLUE_LIVING, GameLogic.RED_LIVING, GameLogic.BLUE_DYING, GameLogic.RED_DYING]
                                               : [GameLogic.BLUE_LIVING, GameLogic.RED_LIVING, GameLogic.BLUE_DYING, GameLogic.RED_DYING];
        const neighborIndexes = [-1, 0, 1]; 
        let neighbors = [];
        for(const i of neighborIndexes) {
            for(const j of neighborIndexes) {
                if (i != 0 && j != 0) { //not cell itself
                    const row = coord[0] + i;
                    const column = coord[1] + j;
                    const idNeighbor = GameLogic.getIdFromMatrixPosition(row, column, boardSize);
                    if (row >= 0 && row < boardSize
                        && column >= 0 && column < boardSize
                        && consideredCells.includes(board[idNeighbor].state)) {                        
                        neighbors.push(idNeighbor);                 
                    }
                }
            }
        }
        return neighbors;
    }

    //PRIVATE LOGIC FUNCTIONS

    /**
     * Ids are generated from Top to Bottom and Left to Right
     * @param id id to convert
     * @return Array with two numbers representing [row, column] in a matrix space
     */
    private static getMatrixPositionFromId(id: number, boardSize: number) {
        return [id%boardSize, Math.floor(id/boardSize)];
    }

    /**
     * Match matrix coordinates into cells ids
     * @param row
     * @param colmn
     * @return id cell
     */
    private static getIdFromMatrixPosition(row: number, column:number, boardSize: number): number {
        return row + column * boardSize ;
    }
}