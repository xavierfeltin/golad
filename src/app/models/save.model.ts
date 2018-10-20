import { Cell, FactoryCell } from "./cell.model";
import { TurnStateModel } from "../state/turn.state";
import { Player, FactoryPlayer } from "./player.model";
import { FactoryTurn } from "./turn.model";

export interface Save {
    board: Cell[];
    player: Player;
    turn: TurnStateModel;
}

export class FactorySave {
    public static create(board: Cell[], turn: TurnStateModel, player: Player): Save {
        return {
            board: [...board].map(cell => FactoryCell.copy(cell)), 
            player: FactoryPlayer.copy(player), 
            turn: FactoryTurn.copy(turn)};
    }
}