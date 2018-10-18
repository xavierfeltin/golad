import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { CreateBoard, ApplyLife } from '../../actions/board.action';
import { Observable } from 'babylonjs';
import { PlayerState } from '../../state/player.state';
import { Player } from '../../models/player.model';
import { TurnStateModel, TurnState } from '../../state/turn.state';

@Component({
  selector: 'app-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {
  /*
  @Select(state => state.turn.nbTurn) turn$: Observable<number>;
  @Select(state => state.turn.currentPlayer) player$: Observable<number>;
  @Select(state => state.turn.isPlayerEndOfTurn) endTurn$: Observable<boolean>;
  @Select(state => state.turn.isEndOfGame) endGame$: Observable<boolean>;
  */
  @Select(TurnState.getTurn) turn$: Observable<TurnStateModel>;
  @Select(PlayerState.getPlayers) players$: Observable<Player[]>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  createGame() {
    this.store.dispatch(new CreateBoard(20));
  }
}
