export interface Player {
    name: string;
    score: number;
    isWinner: boolean;
}

export class FactoryPlayer {
    public static copy(player: Player): Player {
        return {name: player.name, score: player.score, isWinner: player.isWinner};
    }
}