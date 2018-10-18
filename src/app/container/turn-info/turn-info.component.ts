import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameLogic } from '../../engine/logic';
import { Player } from '../../models/player.model';
import { TurnState, TurnStateModel } from '../../state/turn.state';

@Component({
  selector: 'app-turn-info',
  templateUrl: './turn-info.component.html',
  styleUrls: ['./turn-info.component.css']
})
export class TurnInfoComponent implements OnInit {
  /*
  @Input() turn: number = 0;
  @Input() player: number = 0;
  @Input() isEndPlayerTurn: boolean = false;
  @Input() isEndGame: boolean = false;
  */
  @Input() turn: TurnStateModel;
  @Input() players: Player[] = [];
  @Output() nextTurn = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isBluePlayer() {
    return this.turn.currentPlayer == GameLogic.BLUE_PLAYER;
  }

  isBlueWinner() {
    return this.players[GameLogic.BLUE_PLAYER].isWinner;
  }

  displayPlayer(player: number) {    
    return this.players[player].name;
  }

  displayBluePlayer() {    
    return this.players[GameLogic.BLUE_PLAYER].name;
  }

  displayRedPlayer() {    
    return this.players[GameLogic.RED_PLAYER].name;
  }

  displayScoreBluePlayer() {    
    return this.players[GameLogic.BLUE_PLAYER].score;
  }

  displayScoreRedPlayer() {    
    return this.players[GameLogic.RED_PLAYER].score;
  }
  
  applyLife() {
    this.nextTurn.emit();
  }
}
