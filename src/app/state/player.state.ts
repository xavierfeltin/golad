import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetScore, RestorePlayer, PlayerReset, SetWinner, SetPlayer } from '../actions/players.action';
import { Player } from '../models/player.model';
import { GameLogic } from '../engine/logic';

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

    @Action(SetPlayer)
    setPlayer(ctx: StateContext<PlayerStateModel>, { player, name, mode }: SetPlayer) {        
        const players = ctx.getState();
        const updPlayers = [...players.players];
        const isHuman = (mode === GameLogic.HUMAN);

        updPlayers[player] = {                
            name: name,
            score: updPlayers[player].score,
            isWinner: updPlayers[player].isWinner,
            human: isHuman
        }
            
        ctx.patchState({
            players: updPlayers
        });                      
    }

    @Action(SetScore)
    setScore(ctx: StateContext<PlayerStateModel>, { player, score }: SetScore) {
        const players = ctx.getState();
        const updPlayers = [...players.players];

        updPlayers[player] = {                
            name: updPlayers[player].name,
            score: score,
            isWinner: updPlayers[player].isWinner,
            human: updPlayers[player].human,
        }
            
        ctx.patchState({
            players: updPlayers
        });                      
    }

    @Action(SetWinner)
    setWinner(ctx: StateContext<PlayerStateModel>, { player, isWinner }: SetWinner) {
        const players = ctx.getState();
        const updPlayers = [...players.players];

        updPlayers[player] = {                
            name: updPlayers[player].name,
            score: updPlayers[player].score,
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

    @Action(PlayerReset)
    playerReset(ctx: StateContext<PlayerStateModel>) {
        ctx.patchState({
            players: [
                {name: 'Blue', score: 0, isWinner: false, human: true},
                {name: 'Red', score: 0, isWinner: false, human: true}
            ]
        });
    }
}