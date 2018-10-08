export class Player {
    
    static NB_NEIGHBORS = 3;

    public static addCell(id: number, cells: number[]): number[] {
        return [...cells, id];
    }

    public static removeCell(id: number, cells: number[]): number[] {
        const index = cells.findIndex((cellId) => {return cellId == id});
        return [...cells.slice(0,index),...cells.slice(index)];
    }

    public static getScore(cells: number[]): number {
        return cells.length;
    }

    /**
     * Return true of there is exactly 3 neighbors around the cell
     * @param neighbors: list of neighbors around the cell
     */
    public static isCellConfortable(neighbors: number): boolean {
        return neighbors == this.NB_NEIGHBORS;
    }
}