import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { CreateBoard, AttributeCell, ApplyLife, RestoreBoard, BoardReset, UpdateScore } from '../actions/board.action';
import { Cell, FactoryCell } from '../models/cell.model';
import { GameLogic } from '../engine/logic';
import { SetPlayerRemainingActions, NextPlayerTurn, EndGame, SetHalfCell, ManageTurn } from '../actions/turn.action';
import { TurnState } from './turn.state';
import { SetScore, SetWinner } from '../actions/players.action';
import { PlayerState } from './player.state';
import { AddSave } from '../actions/savepoint.action';
import { Move, FactoryMove } from '../models/move.model';
import { FactoryBoardCells } from '../models/board.model';
import { v4 as uuid } from 'uuid';
import { GameState } from './game.state';

    export class BoardStateModel {
        public id: string;
        public size: number;
        public cells: Cell[];
        public lastMove: Move;
    }

    @State<BoardStateModel> ({
        name: 'board',
        defaults: {
            id: '',
            size: 0,
            cells: [],
            lastMove: null
        }
    })
    export class BoardState {

    constructor(private store: Store) {}

    @Selector()
    static getBoardCells(state: BoardStateModel) {
        return state.cells; 
    }

    @Selector()
    static getBoard(state: BoardStateModel) {
        return state; 
    }

    @Action(CreateBoard)
    createBoard(ctx: StateContext<BoardStateModel>, { size }: CreateBoard) {
        const board = GameLogic.getRandomBoard();
        
        ctx.patchState({
            id: uuid(),
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

        ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells));   
        ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells));           
        ctx.dispatch(new ManageTurn());
    }

    @Action(AttributeCell)
    attributeCell(ctx: StateContext<BoardStateModel>, { cell }: AttributeCell) {
        const board = ctx.getState();

        const game = this.store.selectSnapshot(GameState.getGameState);
        if (!game.isGameOnGoing) { return board; }

        const playerRemainingActions = this.store.selectSnapshot(TurnState.getRemainingActions);
        let halfCell = FactoryCell.copy(this.store.selectSnapshot(TurnState.getHalfCell));
        const currentPlayer = this.store.selectSnapshot(TurnState.getCurrentPlayer);
        const players = this.store.selectSnapshot(PlayerState.getPlayers);
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
            let updatedBoard = FactoryBoardCells.copy(board.cells);

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
            saveCells.push(...FactoryBoardCells.copy(neighborsCells));
            GameLogic.updatePickedNeighbors(neighborsCells, updatedBoard, board.size);
            
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

            //Player has more actions when creating a cell
            let remainingActions = playerRemainingActions - 1;
            if (GameLogic.isNewCell(pickedCell)) {
                remainingActions = 2;
            }

            //Update the board state
            ctx.patchState({
                id: board.id,
                size: board.size,
                cells: updatedBoard,
                lastMove: FactoryMove.create(pickedCell, players[currentPlayer], remainingActions)
            });
            
            //Update the turn state
            if (GameLogic.isNewCell(pickedCell)) {
                ctx.dispatch(new SetHalfCell(pickedCell));                
            }
            else {                
                if (halfCell != null) {                    
                    if (remainingActions == 0) { ctx.dispatch(new SetHalfCell(null)); }
                    else {ctx.dispatch(new SetHalfCell(halfCell)); }
                }                                
            }        
            ctx.dispatch(new SetPlayerRemainingActions(remainingActions));    

            //Update the players
            /*
            ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, scores[GameLogic.BLUE_PLAYER], false));   
            ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, scores[GameLogic.RED_PLAYER], false)); 
            */
        }
        return board;        
    }

    @Action(UpdateScore)
    updateScore(ctx: StateContext<BoardStateModel>) {
        const board = ctx.getState();

        const scores = GameLogic.getScore(board.cells);
        const countBlueCells = scores[GameLogic.BLUE_PLAYER];
        const countRedCells = scores[GameLogic.RED_PLAYER];

        ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells));
        ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells));
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

        const game = this.store.selectSnapshot(GameState.getGameState);
        if (!game.isGameOnGoing) { return board; }
        
        const updatedBoard = GameLogic.applyLife(board.cells);        
        
        ctx.patchState({
            id: board.id,
            size: board.size,
            cells: updatedBoard,
            lastMove: null
        });

        let isBlueWinner = false;
        let isRedWinner = false;
        const scores = GameLogic.getScore(updatedBoard);
        const countBlueCells = scores[GameLogic.BLUE_PLAYER];
        const countRedCells = scores[GameLogic.RED_PLAYER];
                
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

        ctx.dispatch(new SetScore(GameLogic.BLUE_PLAYER, countBlueCells));
        ctx.dispatch(new SetScore(GameLogic.RED_PLAYER, countRedCells));
        ctx.dispatch(new SetWinner(GameLogic.BLUE_PLAYER, isBlueWinner));
        ctx.dispatch(new SetWinner(GameLogic.RED_PLAYER, isRedWinner));
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
            id: board.id,
            size: board.size,
            cells: updatedBoard,
            lastMove: FactoryMove.copy(board.lastMove)
        });      
    }

    @Action(BoardReset)
    boardReset(ctx: StateContext<BoardStateModel>) {        
        ctx.patchState({
            id: '',
            size: 0,
            cells: [],
            lastMove: null
        });      
    }
}
