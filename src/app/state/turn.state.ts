import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { EndPlayerTurn, SetPlayerRemainingActions, NextTurn, NextPlayerTurn, EndGame, SetHalfCell, TurnReset, RestoreTurn } from '../actions/turn.action';
import { GameLogic } from '../engine/logic';
import { SetScore } from '../actions/players.action';
import { PlayerState } from './player.state';
import { Cell } from '../models/cell.model';

export class TurnStateModel {
    public nbTurn: number;
    public currentPlayer: number;
    public isPlayerEndOfTurn: boolean;
    public isEndOfTurn: boolean;
    public remainingActions: number;
    public isEndOfGame: boolean;
    public halfCell: Cell;
}

@State<TurnStateModel> ({
    name: 'turn',
    defaults: {
        nbTurn: 0,
        currentPlayer: GameLogic.BLUE_PLAYER,
        isPlayerEndOfTurn: false,
        isEndOfTurn: false,
        remainingActions: 1,
        isEndOfGame: false,
        halfCell: null
    }
})
export class TurnState {
    constructor(private store: Store) {}

    @Selector()
    static getTurn(state: TurnStateModel) {
        return state;  
    }

    @Selector()
    static getRemainingActions(state: TurnStateModel) {
      return state.remainingActions;
    }

    @Selector()
    static getCurrentPlayer(state: TurnStateModel) {
        return state.currentPlayer;
    }

    @Selector()
    static getHalfCell(state: TurnStateModel) {
        return state.halfCell;
    }

    @Action(EndPlayerTurn)
    endPlayerTurn(ctx: StateContext<TurnStateModel>) {        
        const turn= ctx.getState();
        
        //Finalize player turn            
        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: true,
            isEndOfTurn: turn.isEndOfTurn,
            remainingActions: turn.remainingActions,
            isEndOfGame: turn.isEndOfGame,
            halfCell: turn.halfCell
        });      
    }

    @Action(NextPlayerTurn)
    nextPlayerTurn(ctx: StateContext<TurnStateModel>) {        
        const turn= ctx.getState();
        
        if (turn.currentPlayer == GameLogic.BLUE_PLAYER) {
            ctx.patchState({
                nbTurn: turn.nbTurn,
                currentPlayer: GameLogic.RED_PLAYER,
                isPlayerEndOfTurn: false,
                isEndOfTurn: turn.isEndOfTurn,
                remainingActions: 1,
                isEndOfGame: turn.isEndOfGame,
                halfCell: turn.halfCell
            });    
        }
        else {
            ctx.dispatch(new NextTurn());
        }
    }


    @Action(NextTurn)
    nextTurn(ctx: StateContext<TurnStateModel>) {        
        const turn= ctx.getState();
        ctx.patchState({
            nbTurn: turn.nbTurn + 1,
            currentPlayer: GameLogic.BLUE_PLAYER,
            isPlayerEndOfTurn: false,
            isEndOfTurn: false,
            remainingActions: 1,
            isEndOfGame: turn.isEndOfGame,
            halfCell: turn.halfCell
        });
    }

    @Action(SetPlayerRemainingActions)
    setPlayerRemainingActions(ctx: StateContext<TurnStateModel>, { nbActions }: SetPlayerRemainingActions) {
        const turn= ctx.getState();
        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: turn.isEndOfTurn,
            remainingActions: nbActions,
            halfCell: turn.halfCell,
            isEndOfGame: turn.isEndOfGame
        });

        if (nbActions == 0) {
            ctx.dispatch(new EndPlayerTurn());
        }
    }

    @Action(EndGame)
    endGame(ctx: StateContext<TurnStateModel>, { winner} : EndGame) {
        const turn= ctx.getState();
        const players = this.store.selectSnapshot(PlayerState.getPlayers);

        if (winner != GameLogic.NO_PLAYER) {
            ctx.dispatch( new SetScore(winner, players[winner].score, true));   
        }
        
        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: turn.isEndOfTurn,
            isEndOfGame: true,
            halfCell: turn.halfCell,
            remainingActions: 0
        });
    }

    @Action(SetHalfCell)
    setHalfCell(ctx: StateContext<TurnStateModel>, { cell } : SetHalfCell) {
        const turn= ctx.getState();
        
        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: turn.isEndOfTurn,
            isEndOfGame: turn.isEndOfGame,
            halfCell: cell,
            remainingActions: turn.remainingActions
        });
    }

    @Action(TurnReset)
    reset(ctx: StateContext<TurnStateModel>) {
        const turn= ctx.getState();
        
        ctx.patchState({
            nbTurn: 0,
            currentPlayer: GameLogic.BLUE_PLAYER,
            isPlayerEndOfTurn: false,
            isEndOfTurn: false,
            isEndOfGame: false,
            halfCell: null,
            remainingActions: 1
        });
    }

    @Action(RestoreTurn)
    restoreTurn(ctx: StateContext<TurnStateModel>, { turn }: RestoreTurn) {
        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: turn.isEndOfTurn,
            remainingActions: turn.remainingActions,
            isEndOfGame: turn.isEndOfGame,
            halfCell: turn.halfCell
        });
    }
}