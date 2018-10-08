import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateBoard, AttributeCell, ApplyLife } from '../actions/board.action';
import { BoardModel } from '../models/board.model';
import { Cell } from '../models/cell.model';
import { Game } from '../engine/game';

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
        })
    }

    @Action(AttributeCell)
    attributeCell(ctx: StateContext<BoardStateModel>, { cell, player }: AttributeCell) {
        const board = ctx.getState();
        ctx.patchState({
            size: board.size,
            cells: board.cells.map(boardCell => {
                if (boardCell.id === cell.id) {
                    boardCell.player = player;
                    if (boardCell.state == Game.RED_LVING) {
                        boardCell.state = Game.EMPTY;
                    }
                    else {
                        boardCell.state = Game.RED_LVING;
                    }
                }
                return boardCell;
            })
        });
    }

    @Action(ApplyLife)
    applyLife(ctx:  StateContext<BoardStateModel>) {
        const board = ctx.getState();
        ctx.patchState({
            size: board.size,
            cells: board.cells.map(boardCell => {
                if (boardCell.state != Game.EMPTY){
                    boardCell.player = 1 - boardCell.player; //inverse player for now
                    boardCell.state = 6 - boardCell.state + 1;
                }
                return boardCell;
            })
        })
    }
}