import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { CreateBoard, ApplyLife } from '../../actions/board.action';
import { Observable } from 'babylonjs';
import { PlayerState } from '../../state/player.state';

@Component({
  selector: 'app-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {
  @Select(state => state.turn.nbTurn) turn$: Observable<number>;
  @Select(state => state.turn.currentPlayer) player$: Observable<number>;
  @Select(state => state.turn.isPlayerEndOfTurn) endTurn$: Observable<boolean>;
  @Select(state => state.turn.isEndOfGame) endGame$: Observable<boolean>;
  @Select(PlayerState.scores) scores$: Observable<number[]>;
  @Select(PlayerState.names) names$: Observable<string[]>;
  @Select(PlayerState.winners) winners$: Observable<boolean[]>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  createGame() {
    this.store.dispatch(new CreateBoard(20));
  }

  applyLife() {
    this.store.dispatch(new ApplyLife());    
  }
}
