import { Cell } from "../models/cell.model";

export class EndPlayerTurn {
    static readonly type = '[TURN] End Player Turn';    
}

/*
export class EndTurn {
    static readonly type = '[TURN] End Turn';
}
*/

export class NextTurn {
    static readonly type = '[TURN] Next Turn';
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