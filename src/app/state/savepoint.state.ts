import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Save, FactorySave } from '../models/save.model';
import { AddSave, RemoveLastSave, RestoreLastTurn } from '../actions/savepoint.action';
import { RestoreTurn } from '../actions/turn.action';
import { RestoreBoard } from '../actions/board.action';
import { RestorePlayer } from '../actions/players.action';

export class SavePointStateModel {
    savepoints: Save[];
}

@State<SavePointStateModel> ({
    name: 'savepoint',
    defaults: {
       savepoints: []
    }
})
export class SavePointState {
    @Selector()
    static getRestorePoint(state: SavePointStateModel) {
        if(state.savepoints.length == 0) {
            return null;
        }
        else {
            return state.savepoints[-1];
        }
    }

    @Selector()
    static getNbRestorePoints(state: SavePointStateModel) {
        return state.savepoints.length;
    }

    @Action(AddSave)
    addSave(ctx: StateContext<SavePointStateModel>, {cells, turn, player}: AddSave) {        
        const saves = ctx.getState();
        ctx.patchState({
            savepoints: [...saves.savepoints, FactorySave.create(cells, turn, player)]
        });      
    }

    @Action(RemoveLastSave)
    removeLastSave(ctx: StateContext<SavePointStateModel>) {        
        const saves = ctx.getState();
        let savepoints = [...saves.savepoints];
        savepoints.pop();

        ctx.patchState({
            savepoints: savepoints
        });      
    }

    @Action(RestoreLastTurn)
    restoreLastTurn(ctx: StateContext<SavePointStateModel>) {
        const saves = ctx.getState();
        const last = saves.savepoints[saves.savepoints.length-1];
        
        ctx.dispatch( new RestoreTurn(last.turn));
        ctx.dispatch( new RestoreBoard(last.board));
        ctx.dispatch( new RestorePlayer(last.player));
        ctx.dispatch( new RemoveLastSave());
    }
}