import { Cell } from "../models/cell.model";

export interface IA {
    playerId: number;

    /**
     * Return the cell selected by the IA
     */
    play(board: Cell[]): Cell;

    //Get the cost function result for the current solution
    computeCostFunction(prevBoard: Cell[], board: Cell[], player: number): number;
}