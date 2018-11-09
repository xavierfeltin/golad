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
                state: GameLogic.EMPTY,
                neighbors: GameLogic.getNeighborsIds(row + (col * 20),20)
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
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);

    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    const neighbors = GameLogic.getNeighbors(cell, board, 20, GameLogic.MODE_PICKING);
    expect(neighbors.length).toBe(3);
    expect([24,26,5].includes(neighbors[0].id)).toBeTruthy();
    expect([24,26,5].includes(neighbors[1].id)).toBeTruthy();
    expect([24,26,5].includes(neighbors[2].id)).toBeTruthy();
});

test('get all 9 cells neighbors for id 25', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);

    const expectedIds = [4, 24, 44, 45, 46, 26, 6, 5];
    const neighbors = GameLogic.getNeighbors(cell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    expect(neighbors.length).toBe(8);
    for(const neighbor of neighbors) {
        expect(expectedIds.includes(neighbor.id)).toBeTruthy();
    }
});

test('cell 25 is living has 3 neighbors and it lives', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeTruthy();
});

test('cell 25 is living has 2 neighbors and it lives', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeTruthy();
});

test('cell 24 is living has 1 neighbor and it dies', () => {
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('cell 25 is living has 4 neighbors and it dies', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);
    board[45] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [44,64,65,66,46,26,25,24]);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('cell 25 is empty has 3 neighbors and it will be born', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.EMPTY, [24,44,45,46,26,6,5,4]);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeTruthy();
});

test('cell 25 is empty has 2 neighbors and it will not be born', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.EMPTY, [24,44,45,46,26,6,5,4]);

    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('cell 24 is empty has 1 neighbor and it will not be born', () => {
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.EMPTY, [23,43,44,45,25,5,4,3]);
    expect(GameLogic.isCellConfortable(cell, board, 20, GameLogic.MODE_PICKING)).toBeFalsy();
});

test('blue player picks a living cell, it becomes empty', () => {
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.NO_PLAYER);
    expect(updCell.state).toEqual(GameLogic.EMPTY);
});

test('blue player picks an empty cell isolated, it becomes dying', () => {
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.EMPTY, [23,43,44,45,25,5,4,3]);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.NEW_CELL_DYING);
});

test('blue player picks an empty cell with 3 neighbours, it becomes living', () => {
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);
    const cell = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.EMPTY, [24,44,45,46,26,6,5,4]);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(25);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.NEW_CELL);
});

test('One blue cell with 2 blue cells one case away, 2 new blue cells are born between', () => {
    board[27] = FactoryCell.create(27, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [26,46,47,48,28,8,7,6]);
    board[47] = FactoryCell.create(47, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [46,66,67,68,48,28,27,26]);
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.DYING, [24,44,45,46,26,6,5,4]);

    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    //const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);
    GameLogic.updatePickedNeighbors(neighbors, board, 20);
    for(let neighbor of neighbors){
        neighbor.player = board[neighbor.id].player;
        neighbor.state = board[neighbor.id].state;
    }

    const bornCells = [26, 46];
    for(const neighbor of neighbors) {
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
    board[27] = FactoryCell.create(27, GameLogic.RED_PLAYER, GameLogic.LIVING, [26,46,47,48,28,8,7,6]);
    board[47] = FactoryCell.create(47, GameLogic.RED_PLAYER, GameLogic.LIVING, [46,66,67,68,48,28,27,26]);
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.DYING, [24,44,45,46,26,6,5,4]);

    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    //const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);
    GameLogic.updatePickedNeighbors(neighbors, board, 20);
    for(let neighbor of neighbors){
        neighbor.player = board[neighbor.id].player;
        neighbor.state = board[neighbor.id].state;
    }

    const bornCells = [26, 46];
    for(const neighbor of neighbors) {
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
    board[25] = FactoryCell.create(25, GameLogic.NO_PLAYER, GameLogic.EMPTY, [24,44,45,46,26,6,5,4]);
    board[26] = FactoryCell.create(26, GameLogic.RED_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[46] = FactoryCell.create(46, GameLogic.RED_PLAYER, GameLogic.LIVING, [45,65,66,67,47,27,26,25]);

    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    //const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);
    GameLogic.updatePickedNeighbors(neighbors, board, 20);
    for(let i = 0; i < neighbors.length; i++){
        neighbors[i].player = board[neighbors[i].id].player;
        neighbors[i].state = board[neighbors[i].id].state;
    }

    const dyingCells = [26, 46];
    for(const neighbor of neighbors) {
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
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.NEW_CELL, [24,44,45,46,26,6,5,4]);
    board[26] = FactoryCell.create(26, GameLogic.RED_PLAYER, GameLogic.DYING, [25,45,46,47,27,7,6,5]);
    board[46] = FactoryCell.create(46, GameLogic.RED_PLAYER, GameLogic.DYING, [45,65,66,67,47,27,26,25]);
    
    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    //const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);
    GameLogic.updatePickedNeighbors(neighbors, board, 20);
    for(let i = 0; i < neighbors.length; i++){
        neighbors[i].player = board[neighbors[i].id].player;
        neighbors[i].state = board[neighbors[i].id].state;
    }
    
    const livingCells = [26, 46];
    const bornCells = [45];
    for(const neighbor of neighbors) {
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
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    board[6] = FactoryCell.create(6, GameLogic.RED_PLAYER, GameLogic.LIVING, [5,25,26,27,7]);
    board[26] = FactoryCell.create(26, GameLogic.RED_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[46] = FactoryCell.create(46, GameLogic.RED_PLAYER, GameLogic.LIVING, [45,65,66,67,47,27,26,25]);
    
    //added cell
    board[24] = FactoryCell.create(24, GameLogic.RED_PLAYER, GameLogic.DYING, [23,43,44,45,25,5,4,3]);
    
    const neighbors = GameLogic.getNeighbors(board[25], board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    //const updNeighbors = GameLogic.updatePickedNeighbors(neighbors, board, 20);
    GameLogic.updatePickedNeighbors(neighbors, board, 20);
    for(let i = 0; i < neighbors.length; i++){
        neighbors[i].player = board[neighbors[i].id].player;
        neighbors[i].state = board[neighbors[i].id].state;
    }

    const dyingCells = [24, 25]
    const livingCells = [6, 26, 46];
    const bornCells = [27];
    for(const neighbor of neighbors) {
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

test('blue player picks a cell to nurrish a new cell isolated, it becomes half dying', () => {
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.NEW_CELL_DYING, [23,43,44,45,25,5,4,3]);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.HALF_CELL_DYING);
});

test('blue player picks a cell to nurrish a half cell isolated, it becomes dying', () => {
    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.HALF_CELL_DYING, [23,43,44,45,25,5,4,3]);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.DYING);
});

test('blue player picks a cell to nurrish a new cell, it becomes half cell', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    board[4] = FactoryCell.create(4, GameLogic.RED_PLAYER, GameLogic.LIVING, [3,23,24,25,5]);

    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.NEW_CELL, [23,43,44,45,25,5,4,3]);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.HALF_CELL);    
});

test('blue player picks a cell to nurrish a half cell isolated, it becomes living', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    board[4] = FactoryCell.create(4, GameLogic.RED_PLAYER, GameLogic.LIVING, [3,23,24,25,5]);

    const cell = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.HALF_CELL, [23,43,44,45,25,5,4,3]);
    const updCell = GameLogic.updatePickedCell(cell, GameLogic.BLUE_PLAYER, board, 20); 
    expect(updCell.id).toEqual(24);
    expect(updCell.player).toEqual(GameLogic.BLUE_PLAYER);
    expect(updCell.state).toEqual(GameLogic.LIVING);
});

test('three stable cells, do not change after evolution', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    board[4] = FactoryCell.create(4, GameLogic.RED_PLAYER, GameLogic.LIVING, [3,23,24,25,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);

    const updBoard = GameLogic.applyLife(board);        
    for(const i in [25,4,5]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(board[i].state);
        expect(updBoard[i].player).toEqual(board[i].player);
    }    
});

test('four stable cells, do not change after evolution', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.LIVING, [24,44,45,46,26,6,5,4]);
    board[45] = FactoryCell.create(45, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [44,64,65,66,46,26,25,24]);
    board[4] = FactoryCell.create(4, GameLogic.RED_PLAYER, GameLogic.LIVING, [3,23,24,25,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);

    const updBoard = GameLogic.applyLife(board);        
    for(const i in [25,4,5, 45]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(board[i].state);
        expect(updBoard[i].player).toEqual(board[i].player);
    }    
});

test('one dying cell, disappears after evolution', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.DYING, [24,44,45,46,26,6,5,4]);

    const updBoard = GameLogic.applyLife(board);        
    expect(updBoard[25].id).toEqual(board[25].id);
    expect(updBoard[25].state).toEqual(GameLogic.EMPTY);
    expect(updBoard[25].player).toEqual(GameLogic.NO_PLAYER);
});

test('one cell to be born in stable environment, becomes living after evolution', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.BORN, [24,44,45,46,26,6,5,4]);
    board[45] = FactoryCell.create(45, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [44,64,65,66,46,26,25,24]);
    board[4] = FactoryCell.create(4, GameLogic.RED_PLAYER, GameLogic.LIVING, [3,23,24,25,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [4,24,25,26,6]);

    const updBoard = GameLogic.applyLife(board);        
    expect(updBoard[25].id).toEqual(board[25].id);
    expect(updBoard[25].state).toEqual(GameLogic.LIVING);
    expect(updBoard[25].player).toEqual(board[25].player);

    for(const i in [4,5, 45]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(board[i].state);
        expect(updBoard[i].player).toEqual(board[i].player);
    }    
});

test('one cell to be born in dying environment, becomes dying after evolution', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.BORN, [24,44,45,46,26,6,5,4]);
    board[45] = FactoryCell.create(45, GameLogic.BLUE_PLAYER, GameLogic.DYING, [44,64,65,66,46,26,25,24]);
    board[4] = FactoryCell.create(4, GameLogic.RED_PLAYER, GameLogic.DYING, [3,23,24,25,5]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.DYING, [4,24,25,26,6]);

    const updBoard = GameLogic.applyLife(board);        
    expect(updBoard[25].id).toEqual(board[25].id);
    expect(updBoard[25].state).toEqual(GameLogic.DYING);
    expect(updBoard[25].player).toEqual(board[25].player);

    for(const i in [4,5, 45]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(GameLogic.EMPTY);
        expect(updBoard[i].player).toEqual(GameLogic.NO_PLAYER);
    }    
});

test('one empty cell in surpopulation of living and dying cell, becomes red born after evolution', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.EMPTY, [24,44,45,46,26,6,5,4]);
    board[24] = FactoryCell.create(24, GameLogic.RED_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[44] = FactoryCell.create(44, GameLogic.RED_PLAYER, GameLogic.LIVING, [43,63,64,65,45,25,24,23]);
    board[45] = FactoryCell.create(45, GameLogic.RED_PLAYER, GameLogic.LIVING, [44,64,65,66,46,26,25,24]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.DYING, [25,45,46,47,27,7,6,5]);
    board[6] = FactoryCell.create(6, GameLogic.RED_PLAYER, GameLogic.DYING, [5,25,26,27,7]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.DYING, [4,24,25,26,6]);

    const updBoard = GameLogic.applyLife(board);        
    expect(updBoard[25].id).toEqual(board[25].id);
    expect(updBoard[25].state).toEqual(GameLogic.BORN);
    expect(updBoard[25].player).toEqual(GameLogic.RED_PLAYER);

    for(const i in [5, 6, 26]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(GameLogic.EMPTY);
        expect(updBoard[i].player).toEqual(GameLogic.NO_PLAYER);
    }    

    for(const i in [24, 44, 45]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(board[i].state);
        expect(updBoard[i].player).toEqual(board[i].player);
    }    
});

test('one empty cell in surpopulation of living and dying cell, becomes blue born after evolution', () => {
    board[25] = FactoryCell.create(25, GameLogic.RED_PLAYER, GameLogic.EMPTY, [24,44,45,46,26,6,5,4]);
    board[24] = FactoryCell.create(24, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [23,43,44,45,25,5,4,3]);
    board[44] = FactoryCell.create(44, GameLogic.BLUE_PLAYER, GameLogic.LIVING, [43,63,64,65,45,25,24,23]);
    board[45] = FactoryCell.create(45, GameLogic.RED_PLAYER, GameLogic.LIVING, [44,64,65,66,46,26,25,24]);
    board[26] = FactoryCell.create(26, GameLogic.BLUE_PLAYER, GameLogic.DYING, [25,45,46,47,27,7,6,5]);
    board[6] = FactoryCell.create(6, GameLogic.RED_PLAYER, GameLogic.DYING, [5,25,26,27,7]);
    board[5] = FactoryCell.create(5, GameLogic.BLUE_PLAYER, GameLogic.DYING, [4,24,25,26,6]);

    const updBoard = GameLogic.applyLife(board);        
    expect(updBoard[25].id).toEqual(board[25].id);
    expect(updBoard[25].state).toEqual(GameLogic.BORN);
    expect(updBoard[25].player).toEqual(GameLogic.BLUE_PLAYER);

    for(const i in [5, 6, 26]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(GameLogic.EMPTY);
        expect(updBoard[i].player).toEqual(GameLogic.NO_PLAYER);
    }    

    for(const i in [24, 44, 45]) {
        expect(updBoard[i].id).toEqual(board[i].id);
        expect(updBoard[i].state).toEqual(board[i].state);
        expect(updBoard[i].player).toEqual(board[i].player);
    }    
});

test('one blue new cell then remove a blue to feed it, the new cell should not become red', () => {
    board[25] = FactoryCell.create(25, GameLogic.BLUE_PLAYER, GameLogic.NEW_CELL_DYING, [24,44,45,46,26,6,5,4]);
    board[24] = FactoryCell.create(24, GameLogic.NO_PLAYER, GameLogic.EMPTY, [23,43,44,45,25,5,4,3]);
    board[44] = FactoryCell.create(44, GameLogic.NO_PLAYER, GameLogic.EMPTY, [43,63,64,65,45,25,24,23]);
    board[45] = FactoryCell.create(45, GameLogic.RED_PLAYER, GameLogic.LIVING, [44,64,65,66,46,26,25,24]);
    board[46] = FactoryCell.create(46, GameLogic.RED_PLAYER, GameLogic.LIVING, [45,65,66,67,47,27,26,25]);
    board[26] = FactoryCell.create(26, GameLogic.RED_PLAYER, GameLogic.LIVING, [25,45,46,47,27,7,6,5]);
    board[6] = FactoryCell.create(6, GameLogic.RED_PLAYER, GameLogic.LIVING, [5,25,26,27,7]);
    board[5] = FactoryCell.create(5, GameLogic.NO_PLAYER, GameLogic.EMPTY, [4,24,25,26,6]);

    //change 4 to empty to fill 25 new cell
    board[4] = FactoryCell.create(4, GameLogic.NO_PLAYER, GameLogic.EMPTY, [3,23,24,25,5]);

    const updatedHalfCell = GameLogic.updatePickedCell(board[25], GameLogic.BLUE_PLAYER, board, 20);
    expect(updatedHalfCell.id).toEqual(board[25].id);
    expect(updatedHalfCell.state).toEqual(GameLogic.HALF_CELL_DYING);
    expect(updatedHalfCell.player).toEqual(GameLogic.BLUE_PLAYER);
});

test('one blue new cell close to a red square to open the formation', () => {
    board[44] = FactoryCell.create(44, GameLogic.RED_PLAYER, GameLogic.LIVING, [43,63,64,65,45,25,24,23]);
    board[45] = FactoryCell.create(45, GameLogic.RED_PLAYER, GameLogic.LIVING, [44,64,65,66,46,26,25,24]);
    board[64] = FactoryCell.create(64, GameLogic.RED_PLAYER, GameLogic.LIVING, [63,83,84,85,65,45,44,43]);
    board[65] = FactoryCell.create(65, GameLogic.RED_PLAYER, GameLogic.LIVING, [64,84,85,86,66,46,45,44]);
    
    //change 4 to break red formation
    const updatedHalfCell = GameLogic.updatePickedCell(board[4], GameLogic.BLUE_PLAYER, board, 20);
    board[4].state = updatedHalfCell.state;
    board[4].player = updatedHalfCell.player
    
    expect(board[4].state).toEqual(GameLogic.NEW_CELL_DYING);
    expect(board[4].player).toEqual(GameLogic.BLUE_PLAYER);

    const neighbors = GameLogic.getNeighbors(updatedHalfCell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
    GameLogic.updatePickedNeighbors(neighbors, board, 20);

    expect(board[24].state).toEqual(GameLogic.BORN);
    expect(board[24].player).toEqual(GameLogic.RED_PLAYER);
    
    expect(board[25].state).toEqual(GameLogic.BORN);
    expect(board[25].player).toEqual(GameLogic.RED_PLAYER);

    //simulate two feeds to fill the half cell
    board[4].state = GameLogic.DYING;

    const updBoard = GameLogic.applyLife(board);

    expect(updBoard[4].state).toEqual(GameLogic.EMPTY);
    expect(updBoard[4].player).toEqual(GameLogic.NO_PLAYER);

    expect(updBoard[24].state).toEqual(GameLogic.LIVING);
    expect(updBoard[24].player).toEqual(GameLogic.RED_PLAYER);
    
    expect(updBoard[25].state).toEqual(GameLogic.LIVING);
    expect(updBoard[25].player).toEqual(GameLogic.RED_PLAYER);

    expect(updBoard[44].state).toEqual(GameLogic.DYING);
    expect(updBoard[44].player).toEqual(GameLogic.RED_PLAYER);

    expect(updBoard[45].state).toEqual(GameLogic.DYING);
    expect(updBoard[45].player).toEqual(GameLogic.RED_PLAYER);

    expect(updBoard[43].state).toEqual(GameLogic.BORN);
    expect(updBoard[43].player).toEqual(GameLogic.RED_PLAYER);
    
    expect(updBoard[46].state).toEqual(GameLogic.BORN);
    expect(updBoard[46].player).toEqual(GameLogic.RED_PLAYER);
});