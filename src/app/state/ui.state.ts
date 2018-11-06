import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { BeginMoveRendering, EndMoveRendering, BeginBoardRendering, EndBoardRendering, UIReset } from '../actions/ui.action';
import { ManageTurn, NextMove } from '../actions/turn.action';

export class UIStateModel {
    public isMoveRendering: boolean;
    public isBoardRendering: boolean;
}

@State<UIStateModel> ({
    name: 'ui',
    defaults: {
       isMoveRendering: false,
       isBoardRendering: false
    }
})
export class UIState {

    @Selector()
    static getUIRendering(state: UIStateModel) {
        return state;
    }

    @Selector()
    static getBoardRendering(state: UIStateModel) {
        return state.isBoardRendering;
    }

    @Action(BeginMoveRendering)
    beginMoveRendering(ctx: StateContext<UIStateModel>) { 
        ctx.patchState({
            isMoveRendering: true,
            isBoardRendering: false
        });
    }

    @Action(EndMoveRendering)
    endMoveRendering(ctx: StateContext<UIStateModel>) {        
        ctx.patchState({
            isMoveRendering: false,
            isBoardRendering: false
        });        
        ctx.dispatch(new ManageTurn());
    }

    @Action(BeginBoardRendering)
    BeginBoardRendering(ctx: StateContext<UIStateModel>) {      
        ctx.patchState({
            isMoveRendering: false,
            isBoardRendering: true
        });
    }

    @Action(EndBoardRendering)
    endBoardRendering(ctx: StateContext<UIStateModel>) {        
        ctx.patchState({
            isMoveRendering: false,
            isBoardRendering: false
        });
        ctx.dispatch(new ManageTurn(true));
    }

    @Action(UIReset)
    uiReset(ctx: StateContext<UIStateModel>) {        
        ctx.patchState({
            isMoveRendering: false,
            isBoardRendering: false
        });
    }
}