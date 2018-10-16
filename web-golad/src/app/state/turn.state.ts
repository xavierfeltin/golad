import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { EndPlayerTurn, SetPlayerRemainingActions, NextTurn, NextPlayerTurn, EndGame } from '../actions/turn.action';
import { GameLogic } from '../engine/logic';
import { SetScore } from '../actions/players.action';
import { PlayerState } from './player.state';

export class TurnStateModel {
    public nbTurn: number;
    public currentPlayer: number;
    public isPlayerEndOfTurn: boolean;
    public isEndOfTurn: boolean;
    public remainingActions: number;
    //public winner: string;
    public isEndOfGame: boolean;
}

@State<TurnStateModel> ({
    name: 'turn',
    defaults: {
        nbTurn: 0,
        currentPlayer: GameLogic.BLUE_PLAYER,
        isPlayerEndOfTurn: false,
        isEndOfTurn: false,
        remainingActions: 1,
        //winner: ''
        isEndOfGame: false
    }
})
export class TurnState {
    constructor(private store: Store) {}

    @Selector()
    static getRemainingActions(state: TurnStateModel) {
      return state.remainingActions;
    }

    @Selector()
    static getCurrentPlayer(state: TurnStateModel) {
        return state.currentPlayer;
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
            isEndOfGame: turn.isEndOfGame
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
                isEndOfGame: turn.isEndOfGame
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
            isEndOfGame: turn.isEndOfGame
        });
    }

    /*
    @Action(EndTurn)
    EndTurn(ctx: StateContext<TurnStateModel>) {        
        const turn= ctx.getState();
        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: true,
            remainingActions: turn.remainingActions
        });
        ctx.dispatch(new NextTurn());
    }
    */

    @Action(SetPlayerRemainingActions)
    setPlayerRemainingActions(ctx: StateContext<TurnStateModel>, { nbActions }: SetPlayerRemainingActions) {
        const turn= ctx.getState();
        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: turn.isEndOfTurn,
            remainingActions: nbActions,
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
        ctx.dispatch( new SetScore(winner, players[winner].score, true));

        ctx.patchState({
            nbTurn: turn.nbTurn,
            currentPlayer: turn.currentPlayer,
            isPlayerEndOfTurn: turn.isPlayerEndOfTurn,
            isEndOfTurn: turn.isEndOfTurn,
            //winner: (winner == GameLogic.BLUE_PLAYER) ? 'Blue' : 'Red',
            isEndOfGame: true,
            remainingActions: 0
        });
    }
}