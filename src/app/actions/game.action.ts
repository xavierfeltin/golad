export class StartGame {
    static readonly type = '[GAME] Start Game';    
}

export class StopGame {
    static readonly type = '[GAME] Stop Game';
    constructor(public stopLevel: number) {}
}