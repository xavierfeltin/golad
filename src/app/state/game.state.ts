import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { StartGame, StopGame } from '../actions/game.action';

export class GameStateModel {
    public static NO_STOP_REQUEST: number = 0;
    public static STOP_REQUEST: number = 1;
    public static STOP_DONE: number = 2;

    public isStoppingGame: number;
    public isGameOnGoing: boolean;
}

@State<GameStateModel> ({
    name: 'game',
    defaults: {
        isStoppingGame: GameStateModel.NO_STOP_REQUEST,
        isGameOnGoing: false
    }
})
export class GameState {

    @Selector()
    static getGameState(state: GameStateModel) {
        return state;
    }

    @Action(StartGame)
    startGame(ctx: StateContext<GameStateModel>) { 
        ctx.patchState({
            isStoppingGame: GameStateModel.NO_STOP_REQUEST,
            isGameOnGoing: true
        });
    }

    @Action(StopGame)
    stopGame(ctx: StateContext<GameStateModel>, { stopLevel } : StopGame) {        
        ctx.patchState({
            isStoppingGame: stopLevel,
            isGameOnGoing: false
        });        
    }
}