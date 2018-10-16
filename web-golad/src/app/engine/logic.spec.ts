import { GameLogic } from "./logic";
import { Cell, FactoryCell } from "../models/cell.model";

let board: Cell[];

beforeEach(() => {
    board = [];
    for (let col = 0; col < 20;  col++) {
        for(let row = 0 ; row < 20; row++) {
            board.push({
                id: row + (col * 20),
                player: -1,
                state: GameLogic.EMPTY
            })
        }
    }
});

test('gets row and column for id 1 on board 20x20', () => {
    expect(GameLogic.getMatrixPositionFromId(1, 20)).toEqual([1,0]);
});

test('gets row and column for id 399 on board 20x20', () => {
    expect(GameLogic.getMatrixPositionFromId(399, 20)).toEqual([19,19]);
});

test('gets id 1 for row 1 and column 0 on board 20x20 ', () => {
    expect(GameLogic.getIdFromMatrixPosition(1,0, 20)).toBe(1);
});

test('gets id 399 for row 19 and column 19 on board 20x20 ', () => {
    expect(GameLogic.getIdFromMatrixPosition(19,19, 20)).toBe(399);
});

test('get 3 cell neighbors for id 25', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING);

    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const neighbors = GameLogic.getNeighbors(cell, board, 20, GameLogic.MODE_PICKING);
    expect(neighbors.length).toBe(3);
    expect([24,26,5].includes(neighbors[0].id)).toBeTruthy();
    expect([24,26,5].includes(neighbors[1].id)).toBeTruthy();
    expect([24,26,5].includes(neighbors[2].id)).toBeTruthy();
});

test('get all 9 cells neighbors for id 25', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING);

    const expectedIds = [4, 24, 44, 45, 46, 26, 6, 5];
    const neighbors = GameLogic.getNeighbors(cell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    expect(neighbors.length).toBe(8);
    for(const neighbor of neighbors) {
        expect(expectedIds.includes(neighbor.id)).toBeTruthy();
    }
});

test('cell 25 is living has 3 neighbors and it lives', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeTruthy();
});

test('cell 25 is living has 2 neighbors and it lives', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeTruthy();
});

test('cell 24 is living has 1 neighbor and it dies', () => {
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('cell 25 is living has 4 neighbors and it dies', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[45] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('cell 25 is empty has 3 neighbors and it will be born', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.EMPTY);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeTruthy();
});

test('cell 25 is empty has 2 neighbors and it will not be born', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.EMPTY);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('cell 24 is empty has 1 neighbor and it will not be born', () => {
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.EMPTY);
    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('blue player picks a living cell, it becomes empty', () => {
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.NO_PLAYER);
    expect(updCell.state).toEqual(GameLogic.EMPTY);
});

test('blue player picks an empty cell isolated, it becomes dying', () => {
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.EMPTY);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.DYING);
});

test('blue player picks an empty cell with 3 neighbours, it becomes living', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.EMPTY);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(25);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.LIVING);
});

test('One blue cell with 2 blue cells one case away, 2 new blue cells are born between', () => {
    board[27] = FactoryCell.create(27, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[47] = FactoryCell.create(47, GameLogic.BLUE_PLAYER, GameLogic.LIVING);
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.DYING);

    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);

    const bornCells = [26, 46];
    for(const neighbor of updNeighbors) {
        if (bornCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.BLUE_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.BORN);
        }
        else {
            expect(neighbor.player).toEqual(GameLogic.NO_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.EMPTY);
        }
    }
});

test('One blue cell with 2 red cells one case away, 2 new red cells are born between', () => {
    board[27] = FactoryCell.create(27, GameLogic.RED_PLAYER, GameLogic.LIVING);
    board[47] = FactoryCell.create(47, GameLogic.RED_PLAYER, GameLogic.LIVING);
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.DYING);

    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);

    const bornCells = [26, 46];
    for(const neighbor of updNeighbors) {
        if (bornCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.RED_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.BORN);
        }
        else {
            expect(neighbor.player).toEqual(GameLogic.NO_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.EMPTY);
        }
    }
});

test('One cell with 2 living cells, the cell is killed by player, the neighbors are dying', () => {
    board[25] = FactoryCell.create(25, GameLogic.NO_PLAYER, GameLogic.EMPTY);
    board[26] = FactoryCell.create(26, GameLogic.RED_PLAYER, GameLogic.LIVING);
    board[46] = FactoryCell.create(46, GameLogic.RED_PLAYER, GameLogic.LIVING);

    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);

    const dyingCells = [26, 46];
    for(const neighbor of updNeighbors) {
        if (dyingCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.RED_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.DYING);
        }
        else {
            expect(neighbor.player).toEqual(GameLogic.NO_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.EMPTY);
        }
    }
});

test('2 dying cells, a cell is added next to them by player, the neighbors are living, one cell is born', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.RED_PLAYER, GameLogic.DYING);
    board[46] = FactoryCell.create(46, GameLogic.RED_PLAYER, GameLogic.DYING);
    
    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);

    const livingCells = [26, 46];
    const bornCells = [45];
    for(const neighbor of updNeighbors) {
        if (livingCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.RED_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.LIVING);
        }
        else if(bornCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.RED_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.BORN);
        }
        else {
            expect(neighbor.player).toEqual(GameLogic.NO_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.EMPTY);
        }
    }
});

test('A cell has 3 neighbors below, a cell is added above by player, the cell is dying', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.LIVING);
    board[6] = FactoryCell.create(6, GameLogic.RED_PLAYER, GameLogic.LIVING);
    board[26] = FactoryCell.create(26, GameLogic.RED_PLAYER, GameLogic.LIVING);
    board[46] = FactoryCell.create(46, GameLogic.RED_PLAYER, GameLogic.LIVING);
    
    //added cell
    board[24] = FactoryCell.create(24, GameLogic.RED_PLAYER, GameLogic.DYING);
    
    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);

    const dyingCells = [24, 25]
    const livingCells = [6, 26, 46];
    const bornCells = [27];
    for(const neighbor of updNeighbors) {
        if (livingCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.RED_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.LIVING);
        }
        else if (dyingCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.RED_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.DYING);
        }
        else if(bornCells.includes(neighbor.id)) {
            expect(neighbor.player).toEqual(GameLogic.RED_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.BORN);
        }
        else {
            expect(neighbor.player).toEqual(GameLogic.NO_PLAYER);
            expect(neighbor.state).toEqual(GameLogic.EMPTY);
        }
    }
});