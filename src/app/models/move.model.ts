import { FactoryCell, Cell } from "./cell.model";
import { Player, FactoryPlayer } from "./player.model";

export interface Move {
    pickedCell: Cell;
    player: Player;
}

export class FactoryMove {
    public static create(cell: Cell, player: Player): Move {
        return {pickedCell: FactoryCell.copy(cell), player: FactoryPlayer.copy(player)};
    }

    public static copy(move: Move): Move {
        return {pickedCell: FactoryCell.copy(move.pickedCell), player: FactoryPlayer.copy(move.player)};
    }
}