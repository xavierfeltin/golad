export interface Player {
    name: string;
    score: number;
    isWinner: boolean;
    human: boolean;
}

export class FactoryPlayer {
    public static copy(player: Player): Player {
        return {name: player.name, score: player.score, isWinner: player.isWinner, human: player.human};
    }
}