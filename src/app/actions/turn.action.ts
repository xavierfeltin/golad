import { Cell } from "../models/cell.model";
import { TurnStateModel } from "../state/turn.state";

export class NextMove {
    static readonly type = '[TURN] Next Move';    
}

export class NextPlayerTurn {
    static readonly type = '[TURN] Next Player Turn';
}

export class SetPlayerRemainingActions {
    static readonly type = '[TURN] Set Player Remaining Actions';
    constructor( public nbActions: number) {}
}

export class EndGame {
    static readonly type = '[TURN] End game';
    constructor( public winner: number) {}
}

export class SetHalfCell {
    static readonly type = '[TURN] Set Half Cell';
    constructor( public cell: Cell) {}
}

export class TurnReset {
    static readonly type = '[TURN] Turn Reset';
}

export class RestoreTurn {
    static readonly type = '[TURN] Restore Turn';
    constructor(public turn: TurnStateModel) {}
}