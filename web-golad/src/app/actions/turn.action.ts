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