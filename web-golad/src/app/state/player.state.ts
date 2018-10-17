import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetName, SetScore } from '../actions/players.action';
import { Player } from '../models/player.model';

export class PlayerStateModel {
    players: Player[];
}

@State<PlayerStateModel> ({
    name: 'players',
    defaults: {
        players: [
            {name: '', score: 0, isWinner: false},
            {name: '', score: 0, isWinner: false}
        ]
    }
})
export class PlayerState {
    @Selector()
    static getPlayers(state: PlayerStateModel) {
        return state.players;
    }

    @Selector()
    static scores(state: PlayerStateModel) {
        return [state.players[0].score, state.players[1].score];
    }

    @Selector()
    static names(state: PlayerStateModel) {
        return [state.players[0].name, state.players[1].name];
    }

    @Selector()
    static winners(state: PlayerStateModel) {
        return [state.players[0].isWinner, state.players[1].isWinner];
    }

    @Action(SetName)
    setName(ctx: StateContext<PlayerStateModel>, { player, name }: SetName) {        
        const players = ctx.getState();
        const updPlayers = [...players.players];

        updPlayers[player] = {                
            name: name,
            score: updPlayers[player].score,
            isWinner: updPlayers[player].isWinner
        }
            
        ctx.patchState({
            players: updPlayers
        });                      
    }

    @Action(SetScore)
    setScore(ctx: StateContext<PlayerStateModel>, { player, score, isWinner }: SetScore) {
        const players = ctx.getState();
        const updPlayers = [...players.players];

        updPlayers[player] = {                
            name: updPlayers[player].name,
            score: score,
            isWinner: isWinner
        }
            
        ctx.patchState({
            players: updPlayers
        });                      
    }
}