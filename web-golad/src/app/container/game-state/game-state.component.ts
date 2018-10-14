import { Component, OnInit, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { CreateBoard, ApplyLife } from '../../actions/board.action';
import { Observable } from 'babylonjs';
import { EndPlayerTurn, NextTurn } from '../../actions/turn.action';
import { isEmbeddedView } from '@angular/core/src/view/util';

@Component({
  selector: 'app-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {
  @Select(state => state.turn.nbTurn) turn$: Observable<number>;
  @Select(state => state.turn.currentPlayer) player$: Observable<number>;
  @Select(state => state.turn.isPlayerEndOfTurn) endTurn$: Observable<number>;

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
