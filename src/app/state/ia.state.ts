import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { BeginProcessing, EndProcessing } from '../actions/ia.action';

export class IAStateModel {
    public isProcessing: boolean;
}

@State<IAStateModel> ({
    name: 'ia',
    defaults: {
       isProcessing: false
    }
})
export class IAState {

    @Selector()
    static getIAState(state: IAStateModel) {
        return state;
    }

    @Action(BeginProcessing)
    beginProcessing(ctx: StateContext<IAStateModel>) { 
        ctx.patchState({
            isProcessing: true
        });
    }

    @Action(EndProcessing)
    EndProcessing(ctx: StateContext<IAStateModel>) {   
        ctx.patchState({
            isProcessing: false
        });        
    }
}