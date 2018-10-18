import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models/player.model';
import { GameLogic } from '../../engine/logic';

@Component({
  selector: 'app-players-info',
  templateUrl: './players-info.component.html',
  styleUrls: ['./players-info.component.css']
})
export class PlayersInfoComponent implements OnInit {
  @Input() players: Player[] = [];

  constructor() { }

  ngOnInit() {
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
}
