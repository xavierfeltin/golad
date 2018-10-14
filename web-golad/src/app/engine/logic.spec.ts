import { GameLogic } from "./logic";
import { Cell } from "../models/cell.model";

let board: Cell[] = [];
for (let col = 0; col < 20;  col++) {
    for(let row = 0 ; row < 20; row++) {
        board.push({
            id: row + (col * 20),
            player: -1,
            state: GameLogic.EMPTY
        })
    }
}

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
    board[24] = {
        id: board[24].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[26] = {
        id: board[26].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[5] = {
        id: board[5].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    const neighbors = GameLogic.getNeighbors(25, board, 20, false);
    expect(neighbors.length).toBe(3);
    expect([24,26,5].includes(neighbors[0].id)).toBeTruthy();
    expect([24,26,5].includes(neighbors[1].id)).toBeTruthy();
    expect([24,26,5].includes(neighbors[2].id)).toBeTruthy();
});

test('get all 9 cells neighbors for id 25', () => {
    board[24] = {
        id: board[24].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[26] = {
        id: board[26].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[5] = {
        id: board[5].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    const expectedIds = [4, 24, 44, 45, 46, 26, 6, 5];
    const neighbors = GameLogic.getNeighbors(25, board, 20, true);
    expect(neighbors.length).toBe(8);
    for(const neighbor of neighbors) {
        expect(expectedIds.includes(neighbor.id)).toBeTruthy();
    }
});

test('cell 25 has 3 neighbors and it lives', () => {
    board[24] = {
        id: board[24].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[26] = {
        id: board[26].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[5] = {
        id: board[5].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    expect(GameLogic.isCellConfortable(25, board, 20)).toBeTruthy();
});

test('cell 24 has 1 neighbor and it dies', () => {
    board[25] = {
        id: board[25].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[26] = {
        id: board[26].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    board[5] = {
        id: board[5].id,
        player: GameLogic.BLUE_PLAYER,
        state: GameLogic.BLUE_LIVING
    };

    expect(GameLogic.isCellConfortable(24, board, 20)).toBeFalsy();
});