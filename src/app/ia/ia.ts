import { Cell } from "../models/cell.model";

export interface IA {
    playerId: number;

    /**
     * Return the cell selected by the IA
     */
    play(board: Cell[]): Cell;
}