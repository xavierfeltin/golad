import { Game } from "./game";

const game = new Game('test');
    
test('gets row and column for id 1 on board 20x20', () => {
    expect(game.getMatrixPositionFromId(1)).toEqual([1,0]);
});

test('gets row and column for id 399 on board 20x20', () => {
    expect(game.getMatrixPositionFromId(399)).toEqual([19,19]);
});

test('gets id 1 for row 1 and column 0 on board 20x20 ', () => {
    expect(game.getIdFromMatrixPosition(1,0)).toBe(1);
});

test('gets id 399 for row 19 and column 19 on board 20x20 ', () => {
    expect(game.getIdFromMatrixPosition(19,19)).toBe(399);
});