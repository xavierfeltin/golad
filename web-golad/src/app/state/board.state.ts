import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { CreateBoard, AttributeCell, ApplyLife } from '../actions/board.action';
import { Cell } from '../models/cell.model';
import { GameLogic } from '../engine/logic';
import { SetPlayerRemainingActions, NextTurn } from '../actions/turn.action';
import { TurnState } from './turn.state';

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
        let cells = [];
        const boardSize = size * size;
        for (let i = 0; i < boardSize; i++) {
            const cell: Cell = {
                id: i,
                player: 0,
                state: 0
            }
            cells.push(cell);  
        }

        ctx.patchState({
            size: size,
            cells: [...cells]
        });
    }

    @Action(AttributeCell)
    attributeCell(ctx: StateContext<BoardStateModel>, { cell, player }: AttributeCell) {
        const board = ctx.getState();
        const playerRemainingActions = this.store.selectSnapshot(TurnState.getRemainingActions);
        const currentPlayer = this.store.selectSnapshot(TurnState.getCurrentPlayer);
        const neighborsCells = GameLogic.getNeighbors(cell.id, board.cells, board.size, true);

        if (playerRemainingActions > 0) {
            ctx.patchState({
                size: board.size,
                cells: board.cells.map(boardCell => {
                    if (boardCell.id === cell.id) {
                        boardCell.player = player;
                        if (boardCell.state != GameLogic.EMPTY) {
                            boardCell.state = GameLogic.EMPTY;
                        }
                        else {
                            if (GameLogic.isCellConfortable(cell.id, board.cells, board.size)) {
                                boardCell.state = (currentPlayer == GameLogic.BLUE_PLAYER) ? GameLogic.BLUE_LIVING : GameLogic.RED_LIVING;
                            }
                            else {
                                boardCell.state = (currentPlayer == GameLogic.BLUE_PLAYER) ? GameLogic.BLUE_DYING : GameLogic.RED_DYING;
                            }                            
                        }
                    }
                    else if (neighborsCells.includes(boardCell.id)) {
                        if (GameLogic.isCellConfortable(cell.id, board.cells, board.size)) {
                            boardCell.state = (currentPlayer == GameLogic.BLUE_PLAYER) ? GameLogic.BLUE_BORN : GameLogic.RED_BORN;
                        }
                        else {
                            boardCell.state = (currentPlayer == GameLogic.BLUE_PLAYER) ? GameLogic.BLUE_BORN : GameLogic.RED_BORN;
                        }  
                    }
                    return boardCell;
                })
            });
                    
            ctx.dispatch(new SetPlayerRemainingActions(0));
            //TODO: manage when player needs to delete two cells for creating new cell        
        }
        return board;        
    }

    @Action(ApplyLife)
    applyLife(ctx:  StateContext<BoardStateModel>) {
        const board = ctx.getState();
        ctx.patchState({
            size: board.size,
            cells: board.cells.map(boardCell => {
                if (boardCell.state != GameLogic.EMPTY){
                    boardCell.player = 1 - boardCell.player; //inverse player for now
                    boardCell.state = 6 - boardCell.state + 1;
                }
                return boardCell;
            })
        })

        ctx.dispatch(new NextTurn());
    }
}