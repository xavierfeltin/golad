export interface Cell {
    id: number;
    player: number;
    state: number;
}

export class FactoryCell {
    public static create(id: number, player: number, state: number): Cell {
        return {id: id, player: player, state: state};
    }

    public static copy(cell: Cell): Cell {
        return {id: cell.id, player: cell.player, state: cell.state};
    }
}