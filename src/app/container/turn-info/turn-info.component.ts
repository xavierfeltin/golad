import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameLogic } from '../../engine/logic';
import { Player } from '../../models/player.model';
import { TurnState, TurnStateModel } from '../../state/turn.state';
import { Save } from '../../models/save.model';

@Component({
  selector: 'app-turn-info',
  templateUrl: './turn-info.component.html',
  styleUrls: ['./turn-info.component.css']
})
export class TurnInfoComponent implements OnInit {
  @Input() turn: TurnStateModel;
  @Input() players: Player[] = [];
  @Input() nbSavePoints: number = 0;
  
  @Output() nextTurn = new EventEmitter();
  @Output() undo = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  isBluePlayer() {
    return this.turn.currentPlayer == GameLogic.BLUE_PLAYER;
  }

  isBlueWinner() {
    return this.players[GameLogic.BLUE_PLAYER].isWinner;
  }

  isRedWinner() {
    return this.players[GameLogic.RED_PLAYER].isWinner;
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

  displayNoPlayer() {
    return 'No one';
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

  undoTurn() {
    this.undo.emit();
  }
}
