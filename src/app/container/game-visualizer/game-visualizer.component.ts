import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AttributeCell, ApplyLife } from '../../actions/board.action';
import { Player } from '../../models/player.model';
import { PlayerState } from '../../state/player.state';
import { TurnState, TurnStateModel } from '../../state/turn.state';
import { SavePointState } from '../../state/savepoint.state';
import { RestoreLastTurn } from '../../actions/savepoint.action';
import { IAService } from '../../services/ia.service';
import { BoardState, BoardStateModel } from '../../state/board.state';
import { UIState, UIStateModel } from '../../state/ui.state';
import { EndMoveRendering, EndBoardRendering } from '../../actions/ui.action';

@Component({
  selector: 'app-game-visualizer',
  templateUrl: './game-visualizer.component.html',
  styleUrls: ['./game-visualizer.component.css']
})
export class GameVisualizerComponent implements OnInit {
  
  @Select(state => state.board.size) size$: Observable<number>;
  @Select(BoardState.getBoard) board$: Observable<BoardStateModel>;
  @Select(PlayerState.getPlayers) players$: Observable<Player[]>;
  @Select(TurnState.getTurn) turn$: Observable<TurnStateModel>;
  @Select(SavePointState.getNbRestorePoints) nbSavePoints$: Observable<number>;
  @Select(UIState.getUIRendering) isRendering$: Observable<UIStateModel>;

  pickedName: string = '';

  constructor(private store: Store, private iaService: IAService) {}

  ngOnInit() {}

  onPick(cell) {
    this.store.dispatch(new AttributeCell(cell)); //cell + player    
  }

  onFinishMoveRendering() {        
    this.store.dispatch(new EndMoveRendering()); //cell + player           
  }

  onFinishBoardRendering() {     
    this.store.dispatch(new EndBoardRendering()); //board
  }
    
  applyLife() {
    this.store.dispatch(new ApplyLife());    
  }

  restoreTurn() {
    this.store.dispatch(new RestoreLastTurn());   
  }
}