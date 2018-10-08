import { Cell } from '../models/cell.model';

export class CreateBoard {
    static readonly type = '[BOARD] Create Board';
    constructor(public size: number) {}
}

export class AttributeCell {
    static readonly type = '[BOARD] Add Cell';
    constructor(public cell: Cell, public player: number) {}
}

export class ApplyLife {
    static readonly type = '[BOARD] Apply Live';
}