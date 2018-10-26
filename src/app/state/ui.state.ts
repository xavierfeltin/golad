import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { BeginMoveRendering, EndMoveRendering, BeginLifeRendering, EndLifeRendering } from '../actions/ui.action';
import { NextMove } from '../actions/turn.action';

export class UIStateModel {
    public isMoveRendering: boolean;
    public isLifeRendering: boolean;
}

@State<UIStateModel> ({
    name: 'ui',
    defaults: {
       isMoveRendering: false,
       isLifeRendering: false
    }
})
export class UIState {

    constructor(private store: Store) {}

    @Selector()
    static getUIRendering(state: UIStateModel) {
        return state;
    }

    @Selector()
    static getLifeRendering(state: UIStateModel) {
        return state.isLifeRendering;
    }

    @Action(BeginMoveRendering)
    beginMoveRendering(ctx: StateContext<UIStateModel>) {            
        ctx.patchState({
            isMoveRendering: true,
            isLifeRendering: false
        });
    }

    @Action(EndMoveRendering)
    endMoveRendering(ctx: StateContext<UIStateModel>) {        
        ctx.patchState({
            isMoveRendering: false,
            isLifeRendering: false
        });        

        this.store.dispatch(new NextMove());
    }

    @Action(BeginLifeRendering)
    beginLifeRendering(ctx: StateContext<UIStateModel>) {        
        ctx.patchState({
            isMoveRendering: false,
            isLifeRendering: true
        });
    }

    @Action(EndLifeRendering)
    endLifeRendering(ctx: StateContext<UIStateModel>) {        
        ctx.patchState({
            isMoveRendering: false,
            isLifeRendering: false
        });
    }
}