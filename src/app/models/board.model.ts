import { Cell } from './cell.model';

export interface BoardModel {
    size: number;
    cells: Cell[];
}