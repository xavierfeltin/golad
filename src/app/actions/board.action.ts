import { Cell } from '../models/cell.model';

export class CreateBoard {
    static readonly type = '[BOARD] Create Board';
    constructor(public size: number) {}
}

export class AttributeCell {
    static readonly type = '[BOARD] Add Cell';
    constructor(public cell: Cell) {}
}

export class ApplyLife {
    static readonly type = '[BOARD] Apply Live';
}

export class RestoreBoard {
    static readonly type = '[TURN] Restore Board';
    constructor(public cells: Cell[]) {}
}