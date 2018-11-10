import { Cell } from '../models/cell.model';

export class CreateBoard {
    static readonly type = '[BOARD] Create Board';
    constructor(public configuration: string, public size: number) {}
}

export class AttributeCell {
    static readonly type = '[BOARD] Add Cell';
    constructor(public cell: Cell) {}
}

export class ApplyLife {
    static readonly type = '[BOARD] Apply Live';
}

export class UpdateScore {
    static readonly type = '[BOARD] Update Score';
}

export class RestoreBoard {
    static readonly type = '[TURN] Restore Board';
    constructor(public cells: Cell[]) {}
}

export class BoardReset {
    static readonly type = '[RESET] Board';    
}