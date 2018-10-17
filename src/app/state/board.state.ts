import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { CreateBoard, AttributeCell, ApplyLife } from '../actions/board.action';
import { Cell, FactoryCell } from '../models/cell.model';
import { GameLogic } from '../engine/logic';
import { SetPlayerRemainingActions, NextPlayerTurn, EndGame, SetHalfCell } from '../actions/turn.action';
import { TurnState } from './turn.state';
import { SetName, SetScore } from '../actions/players.action';
import { FactorGradient } from 'babylonjs';

export class BoardStateModel {
    public size: number;
    public cells: Cell[];
}

@State<BoardStateModel> ({
    name: 'board',
    defaults: {
       size: 0,
       cells: []
    }
})
export class BoardState {

    constructor(private store: Store) {}

    @Action(CreateBoard)
    createBoard(ctx: StateContext<BoardStateModel>, { size }: CreateBoard) {
        ctx.patchState({
            size: size,
            cells: GameLogic.getDefaultBoard(size)
        });

        ctx.dispatch(new SetName(GameLogic.BLUE_PLAYER, 'Blue'));
        ctx.dispatch(new SetName(GameLogic.RED_PLAYER, 'Red'));
    }

    @Action(AttributeCell)
    attributeCell(ctx: StateContext<BoardStateModel>, { cell }: AttributeCell) {
        const board = ctx.getState();
        const playerRemainingActions = this.store.selectSnapshot(TurnState.getRemainingActions);
        let halfCell = FactoryCell.copy(this.store.selectSnapshot(TurnState.getHalfCell));
        const currentPlayer = this.store.selectSnapshot(TurnState.getCurrentPlayer);
        
        let updatedBoard = [...board.cells];

        const isApplyPicking = (playerRemainingActions > 0) 
                                && (
                                    (halfCell != null && (
                                        (cell.state == GameLogic.LIVING || cell.state == GameLogic.DYING)
                                        && cell.player == currentPlayer        
                                    ))
                                    || (halfCell == null)
                                );

        if (isApplyPicking) {
            // Update picked cell
            const pickedCell = GameLogic.updatePickedCell(cell, currentPlayer, updatedBoard, board.size);
            updatedBoard[pickedCell.id].state = pickedCell.state;
            updatedBoard[pickedCell.id].player = pickedCell.player;

            // Update neighbors
            const neighborsCells = GameLogic.getNeighbors(cell, updatedBoard, board.size, GameLogic.MODE_ALL_NEIGHBORS);
            const updatedNeighbors = GameLogic.updatePickedNeighbors(neighborsCells, updatedBoard, board.size);
            for (const neighbor of updatedNeighbors) {
                updatedBoard[neighbor.id].state = neighbor.state;
                updatedBoard[neighbor.id].player = neighbor.player;
            }

            if(halfCell != null) {
                //Update associated half cell
                halfCell = GameLogic.updatePickedCell(halfCell, currentPlayer, updatedBoard, board.size);
                updatedBoard[halfCell.id].state = halfCell.state;

                //Update neighbors, could be done only when half-cell is completed
                const neighborsCells = GameLogic.getNeighbors(halfCell, updatedBoard, board.size, GameLogic.MODE_ALL_NEIGHBORS);
                const updatedNeighbors = GameLogic.updatePickedNeighbors(neighborsCells, updatedBoard, board.size);
                for (const neighbor of updatedNeighbors) {
                    updatedBoard[neighbor.id].state = neighbor.state;
                    updatedBoard[neighbor.id].player = neighbor.player;
                }
            }

            ctx.patchState({
                size: board.size,
                cells: updatedBoard
            });
            
            if (pickedCell.state == GameLogic.NEW_CELL) {
                ctx.dispatch(new SetHalfCell(pickedCell));
                ctx.dispatch(new SetPlayerRemainingActions(2));    
            }
            else {
                const remainingActions = playerRemainingActions - 1; 
                if (halfCell != null) {                    
                    if (remainingActions == 0) { ctx.dispatch(new SetHalfCell(null)); }
                    else {ctx.dispatch(new SetHalfCell(halfCell)); }
                }                
                ctx.dispatch(new SetPlayerRemainingActions(remainingActions));
            }        
        }
        return board;        
    }

    @Action(ApplyLife)
    /*
        The Rules:
        For a space that is 'populated':
            Each cell with one or no neighbors dies, as if by solitude.
            Each cell with four or more neighbors dies, as if by overpopulation.
            Each cell with two or three neighbors survives.
        For a space that is 'empty' or 'unpopulated'
            Each cell with three neighbors becomes populated.
    */
    applyLife(ctx:  StateContext<BoardStateModel>) {
        const board = ctx.getState();
        let updatedBoard = [...board.cells];

        const cellsByType = GameLogic.getCellsByType(updatedBoard);
        const newEmptyCells = GameLogic.evolveDyingCells(cellsByType[GameLogic.DYING]); //TODO if needed, split by solitude / overpopulation
        
        let countBlueCells = 0;
        let countRedCells = 0;

        for (const updCell of newEmptyCells) {
            updatedBoard[updCell.id].state = updCell.state;
            updatedBoard[updCell.id].player = updCell.player;
        }

        const newCells = GameLogic.evolveBornCells(cellsByType[GameLogic.BORN], updatedBoard, board.size);
        let newLivingCells = newCells.filter((cell) => { return cell.state == GameLogic.LIVING});
        let newDyingCells = newCells.filter((cell) => { return cell.state == GameLogic.DYING});

        const newUpdCells = GameLogic.evolveLivingCells(cellsByType[GameLogic.LIVING], updatedBoard, board.size);
        newLivingCells = newLivingCells.concat(newUpdCells.filter((cell) => { return cell.state == GameLogic.LIVING}));
        newDyingCells = newDyingCells.concat(newUpdCells.filter((cell) => { return cell.state == GameLogic.DYING}));

        for (const updCell of [...newLivingCells, ...newDyingCells]) {
            updatedBoard[updCell.id].state = updCell.state;
            updatedBoard[updCell.id].player = updCell.player;

            if (updCell.player == GameLogic.BLUE_PLAYER) {countBlueCells ++;} else {countRedCells++;}
        }

        const newBornCells = GameLogic.evolveEmptyCells(cellsByType[GameLogic.EMPTY], updatedBoard, board.size);

        for (const updCell of newBornCells) {
            updatedBoard[updCell.id].state = updCell.state;
            updatedBoard[updCell.id].player = updCell.player;
        }

        ctx.patchState({
            size: board.size,
            cells: updatedBoard
        });

        if (countRedCells == 0) {
            ctx.dispatch(new EndGame(GameLogic.BLUE_PLAYER));
            ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells, true));
            ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells, false));
        }
        else if (countBlueCells == 0) {
            ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells, false));
            ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells, true));
            ctx.dispatch(new EndGame(GameLogic.RED_PLAYER));
        }
        else {
            ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells, false));
            ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells, false));
            ctx.dispatch(new NextPlayerTurn());
        }
    }
}