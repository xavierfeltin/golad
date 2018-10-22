import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { CreateBoard, AttributeCell, ApplyLife, RestoreBoard } from '../actions/board.action';
import { Cell, FactoryCell } from '../models/cell.model';
import { GameLogic } from '../engine/logic';
import { SetPlayerRemainingActions, NextPlayerTurn, EndGame, SetHalfCell } from '../actions/turn.action';
import { TurnState } from './turn.state';
import { SetScore } from '../actions/players.action';
import { PlayerState } from './player.state';
import { AddSave, CleanSavePoints } from '../actions/savepoint.action';

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
        //const board = GameLogic.getDefaultBoard(size);
        const board = GameLogic.getRandomBoard();

        ctx.patchState({
            size: size,
            cells: board
        });

        let countBlueCells = 0;
        let countRedCells = 0;

        for (const cell of board) {
            if (cell.player == GameLogic.BLUE_PLAYER && GameLogic.isLivingCell(cell)) {
                countBlueCells ++;
            }
            else if (cell.player == GameLogic.RED_PLAYER && GameLogic.isLivingCell(cell)) {
                countRedCells ++;
            }
        }

        ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells, false));   
        ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells, false)); 
    }

    @Action(AttributeCell)
    attributeCell(ctx: StateContext<BoardStateModel>, { cell }: AttributeCell) {
        const board = ctx.getState();
        const playerRemainingActions = this.store.selectSnapshot(TurnState.getRemainingActions);
        let halfCell = FactoryCell.copy(this.store.selectSnapshot(TurnState.getHalfCell));
        const currentPlayer = this.store.selectSnapshot(TurnState.getCurrentPlayer);
        let scores = this.store.selectSnapshot(PlayerState.scores);

        let saveCells = [];
        saveCells.push(cell);
        
        const isApplyPicking = (playerRemainingActions > 0) 
                                && (
                                    (halfCell != null && (
                                        (cell.state == GameLogic.LIVING || cell.state == GameLogic.DYING)
                                        && cell.player == currentPlayer        
                                    ))
                                    || (halfCell == null)
                                );

        if (isApplyPicking) {
            let updatedBoard = board.cells.map(c => FactoryCell.copy(c));

            // Update picked cell
            const pickedCell = GameLogic.updatePickedCell(cell, currentPlayer, updatedBoard, board.size);
            updatedBoard[pickedCell.id].state = pickedCell.state;
            updatedBoard[pickedCell.id].player = (pickedCell.state == GameLogic.EMPTY) ? GameLogic.NO_PLAYER : pickedCell.player;

            if(pickedCell.state == GameLogic.EMPTY || pickedCell.state == GameLogic.BORN) {
                scores[cell.player] --;
            }
            else if (pickedCell.state == GameLogic.NEW_CELL || pickedCell.state == GameLogic.NEW_CELL_DYING) {
                scores[currentPlayer] ++;
            }

            // Update neighbors
            const neighborsCells = GameLogic.getNeighbors(cell, updatedBoard, board.size, GameLogic.MODE_ALL_NEIGHBORS);
            saveCells.push(...neighborsCells.map(c => FactoryCell.copy(c)));

            const updatedNeighbors = GameLogic.updatePickedNeighbors(neighborsCells, updatedBoard, board.size);
            for (const neighbor of updatedNeighbors) {
                updatedBoard[neighbor.id].state = neighbor.state;
                updatedBoard[neighbor.id].player = neighbor.player;
            }
            
            if(halfCell != null) {
                //Update associated half cell
                saveCells.push(halfCell);
                halfCell = GameLogic.updatePickedCell(halfCell, currentPlayer, updatedBoard, board.size);
                updatedBoard[halfCell.id].state = halfCell.state;
            }

            //Save initial state for undo action
            const saveTurn = this.store.selectSnapshot(TurnState.getTurn);
            const savePlayer = this.store.selectSnapshot(PlayerState.getPlayers)[currentPlayer];
            ctx.dispatch(new AddSave(saveCells, saveTurn, savePlayer));

            //Update the board state
            ctx.patchState({
                size: board.size,
                cells: updatedBoard
            });
            
            //Update the turn state
            if (GameLogic.isNewCell(pickedCell)) {
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

            //Update the players
            ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, scores[GameLogic.BLUE_PLAYER], false));   
            ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, scores[GameLogic.RED_PLAYER], false)); 
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
    applyLife(ctx: StateContext<BoardStateModel>) {
        const board = ctx.getState();
        
        /*
        let updatedBoard = [...board.cells].map(c => FactoryCell.copy(c));
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
        */

        const updatedBoard = GameLogic.applyLife(board.cells);
        const scores = GameLogic.getScore(updatedBoard);
        const countBlueCells = scores[GameLogic.BLUE_PLAYER];
        const countRedCells = scores[GameLogic.RED_PLAYER];

        ctx.patchState({
            size: board.size,
            cells: updatedBoard
        });

        let isBlueWinner = false;
        let isRedWinner = false;
        if (countBlueCells == 0 && countRedCells == 0){
            ctx.dispatch(new EndGame(GameLogic.NO_PLAYER));
        }
        else if (countRedCells == 0) {
            isBlueWinner = true;
            ctx.dispatch(new EndGame(GameLogic.BLUE_PLAYER));
        }
        else if (countBlueCells == 0) {
            isRedWinner = true;
            ctx.dispatch(new EndGame(GameLogic.RED_PLAYER));
        }
        else {
            ctx.dispatch(new NextPlayerTurn());
        }

        ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells, isBlueWinner));
        ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells, isRedWinner));
        ctx.dispatch(new CleanSavePoints());
    }

    @Action(RestoreBoard)
    restoreBoard(ctx: StateContext<BoardStateModel>, { cells }: RestoreBoard) {
        const board = ctx.getState();
        let updatedBoard = [...board.cells].map(c => FactoryCell.copy(c));

        for (const cell of cells) {
            updatedBoard[cell.id].state = cell.state;
            updatedBoard[cell.id].player = cell.player;
        }

        ctx.patchState({
            size: board.size,
            cells: updatedBoard
        });
    }
}