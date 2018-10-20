import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Cell } from '../../models/cell.model';
import { Observable } from 'rxjs';
import { AttributeCell, ApplyLife } from '../../actions/board.action';
import { Player } from '../../models/player.model';
import { PlayerState } from '../../state/player.state';
import { TurnState, TurnStateModel } from '../../state/turn.state';
import { SavePointState } from '../../state/savepoint.state';
import { RestoreLastTurn } from '../../actions/savepoint.action';

@Component({
  selector: 'app-game-visualizer',
  templateUrl: './game-visualizer.component.html',
  styleUrls: ['./game-visualizer.component.css']
})
export class GameVisualizerComponent implements OnInit {
  
  @Select(state => state.board.size) size$: Observable<number>;
  @Select(state => state.board.cells) cells$: Observable<Cell[]>;
  @Select(PlayerState.getPlayers) players$: Observable<Player[]>;
  @Select(TurnState.getTurn) turn$: Observable<TurnStateModel>;
  @Select(SavePointState.getNbRestorePoints) nbSavePoints$: Observable<number>;
  pickedName: string = '';

  constructor(private store: Store) {}

  ngOnInit() {}

  onPick(cell) {
    this.store.dispatch(new AttributeCell(cell)); //cell + player    
  }
  
  applyLife() {
    this.store.dispatch(new ApplyLife());    
  }

  restoreTurn() {
    this.store.dispatch(new RestoreLastTurn());   
  }
}