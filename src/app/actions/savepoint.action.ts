import { Cell } from "../models/cell.model";
import { TurnStateModel } from "../state/turn.state";
import { Player } from "../models/player.model";

export class AddSave {
    static readonly type = '[GAME] Add Save Point';
    constructor(public cells: Cell[], public turn: TurnStateModel, public player: Player) {}
}

export class RemoveLastSave {
    static readonly type = '[GAME] Remove Last Save';
    constructor() {}
}

export class RestoreLastTurn {
    static readonly type = '[GAME] Restore Last State';
    constructor() {}
}

export class CleanSavePoints {
    static readonly type = '[GAME] Clean Save Points';
    constructor() {}
}