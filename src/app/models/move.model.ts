import { FactoryCell, Cell } from "./cell.model";
import { Player, FactoryPlayer } from "./player.model";

export interface Move {
    pickedCell: Cell;
    player: Player;
    remainingActions: number;
}

export class FactoryMove {
    public static create(cell: Cell, player: Player, nbActions: number): Move {
        return {pickedCell: FactoryCell.copy(cell), player: FactoryPlayer.copy(player), remainingActions: nbActions};
    }

    public static copy(move: Move): Move {
        return {pickedCell: FactoryCell.copy(move.pickedCell), player: FactoryPlayer.copy(move.player), remainingActions: move.remainingActions};
    }
}