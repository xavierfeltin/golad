export interface Cell {
    id: number;
    player: number;
    state: number;
    neighbors: number[];
}

export class FactoryCell {
    public static create(id: number, player: number, state: number, neighbors: number[]): Cell {
        return {id: id, player: player, state: state, neighbors: neighbors};
    }

    public static copy(cell: Cell): Cell {
        if (cell == null) {return null;}
        else {return {id: cell.id, player: cell.player, state: cell.state, neighbors: cell.neighbors};}
    }
}