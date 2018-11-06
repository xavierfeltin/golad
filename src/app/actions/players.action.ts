import { Player } from "../models/player.model";

export class SetName {
    static readonly type = '[CONFIGURATION] Set Name';
    constructor(public player: number, public name: string) {}
}

export class SetScore {
    static readonly type = '[TURN] Set Score';
    constructor(public player: number, public score: number) {}
}

export class SetWinner {
    static readonly type = '[TURN] Set Winner';
    constructor(public player: number, public isWinner: boolean) {}
}

export class RestorePlayer {
    static readonly type = '[TURN] Restore Player';
    constructor(public player: Player) {}
}

export class PlayerReset {
    static readonly type = '[RESET] Player';    
}