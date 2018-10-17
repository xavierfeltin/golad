import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IncrementCounter, DecrementCounter } from '../actions/counter.action';

export class CounterStateModel {
    count: number;
}

@State<CounterStateModel> ({
    name: 'counter',
    defaults: {
        count: 0    
    }
})
export class CounterState {

    // Section 4
    @Selector()
    static getCounter(state: CounterStateModel) {
        return state.count;
    }

    // Section 5
    @Action(IncrementCounter)
    add({getState, patchState }: StateContext<CounterStateModel>) {
        const state = getState();
        patchState({
            count: state.count + 1
        })
    }

    @Action(DecrementCounter)
    remove({getState, patchState }: StateContext<CounterStateModel>) {
        patchState({
            count: getState().count -1
        })
    }
}