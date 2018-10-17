export class SetName {
    static readonly type = '[CONFIGURATION] Set Name';
    constructor(public player: number, public name: string) {}
}

export class SetScore {
    static readonly type = '[TURN] Set Score';
    constructor(public player: number, public score: number, public isWinner: boolean) {}
}