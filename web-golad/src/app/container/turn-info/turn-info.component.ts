import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameLogic } from '../../engine/logic';

@Component({
  selector: 'app-turn-info',
  templateUrl: './turn-info.component.html',
  styleUrls: ['./turn-info.component.css']
})
export class TurnInfoComponent implements OnInit {
  @Input() turn: number = 0;
  @Input() player: number = 0;
  @Input() isEndOfTurn: boolean = false;
  
  @Output() nextTurn = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  displayPlayer(player: number) {
    if (player == GameLogic.BLUE_PLAYER) {
      return 'Blue';
    }
    else {
      return 'Red';
    }
  }

  applyLife() {
    this.nextTurn.emit();
  }
}
