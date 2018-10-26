import { Cell, FactoryCell } from './cell.model';

export interface BoardModel {
    size: number;
    cells: Cell[];
}

export class FactoryBoardCells {
    public static copy(cells: Cell[]): Cell[] {
        const nbCells = cells.length;
        let board = Array(nbCells);        
        for(let i = 0; i < nbCells; i++) {
            board[i] = FactoryCell.copy(cells[i]);
        }
        return board;
    }
}