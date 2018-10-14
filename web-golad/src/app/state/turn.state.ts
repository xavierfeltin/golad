import { State, Action, StateContext, Selector } from '@ngxs/store';
import { EndPlayerTurn, SetPlayerRemainingActions, NextTurn, NextPlayerTurn } from '../actions/turn.action';
import { GameLogic } from '../engine/logic';

export class TurnStateModel {
    public nbTurn: number;
    public currentPlayer: number;
    public isPlayerEndOfTurn: boolean;
    public isEndOfTurn: boolean;
    public remainingActions: number;
}

@State<TurnStateModel> ({
    name: 'turn',
    defaults: {
        nbTurn: 0,
        currentPlayer:0,
        isPlayerEndOfTurn: false,
        isEndOfTurn: false,
        remainingActions: 1
    }
})
export class TurnState {
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
            remainingActions: turn.remainingActions
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
                remainingActions: 1
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
            remainingActions: 1
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
            remainingActions: nbActions
        });

        if (nbActions == 0) {
            ctx.dispatch(new EndPlayerTurn());
        }
    }
}