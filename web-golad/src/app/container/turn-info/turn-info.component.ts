import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameLogic } from '../../engine/logic';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-turn-info',
  templateUrl: './turn-info.component.html',
  styleUrls: ['./turn-info.component.css']
})
export class TurnInfoComponent implements OnInit {
  @Input() turn: number = 0;
  @Input() player: number = 0;
  @Input() isEndPlayerTurn: boolean = false;
  @Input() isEndGame: boolean = false;
  @Input() scores: number[] = [0, 0];
  @Input() names: string[] = ['', ''];
  @Input() winners: boolean[] = [false, false];  
  //@Input() winner: string = '';
  
  @Output() nextTurn = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  displayPlayer(player: number) {    
    return this.names[player];
  }

  displayBluePlayer() {    
    return this.names[GameLogic.BLUE_PLAYER];
  }

  displayRedPlayer() {    
    return this.names[GameLogic.RED_PLAYER];
  }

  displayScoreBluePlayer() {    
    return this.scores[GameLogic.BLUE_PLAYER];
  }

  displayScoreRedPlayer() {    
    return this.scores[GameLogic.RED_PLAYER];
  }

  isBlueWinner() {
    return this.winners[GameLogic.BLUE_PLAYER];
  }

  applyLife() {
    this.nextTurn.emit();
  }
}
