import { TurnStateModel } from "../state/turn.state";
import { FactoryCell } from "./cell.model";

export class FactoryTurn {
    public static copy(turn: TurnStateModel): TurnStateModel {
        return {
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: turn.isEndOfTurn,
            remainingActions: turn.remainingActions,
            isEndOfGame: turn.isEndOfGame,
            halfCell: FactoryCell.copy(turn.halfCell)};
    }
}