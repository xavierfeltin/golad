import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetName, SetScore, RestorePlayer } from '../actions/players.action';
import { Player } from '../models/player.model';

export class PlayerStateModel {
    players: Player[];
}

@State<PlayerStateModel> ({
    name: 'players',
    defaults: {
        players: [
            {name: 'Blue', score: 0, isWinner: false, human: true},
            {name: 'Red', score: 0, isWinner: false, human: true}
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
            isWinner: updPlayers[player].isWinner,
            human: updPlayers[player].human
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
            isWinner: isWinner,
            human: updPlayers[player].human,
        }
            
        ctx.patchState({
            players: updPlayers
        });                      
    }

    @Action(RestorePlayer)
    restorePlayer(ctx: StateContext<PlayerStateModel>, { player }: RestorePlayer) {
        const players = ctx.getState();
        const index = players.players.findIndex(p => p.name === player.name);
        let updPlayers = [...players.players];
        updPlayers[index] = {
            name: player.name,
            score: player.score,
            isWinner: player.isWinner,
            human: player.human
        }

        ctx.patchState({
            players: updPlayers
        });
    }
}