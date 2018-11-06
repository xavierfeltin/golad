import { Injectable } from '@angular/core';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { NextMove } from '../actions/turn.action';
import { TurnState } from '../state/turn.state';
import { PlayerState } from '../state/player.state';
import { BoardState } from '../state/board.state';
import { BasicIA } from '../ia/basic';
import { BeginProcessing, EndProcessing } from '../actions/ia.action';
import { AttributeCell, ApplyLife } from '../actions/board.action';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class IAService {

  constructor(private store: Store, private actions$: Actions) {
    this.actions$.pipe(ofActionSuccessful(NextMove)).subscribe(() => {
      this.store.dispatch(new BeginProcessing());
      this.playIA();
      this.store.dispatch(new EndProcessing());
    });
  }

  private  playIA() {        
    const currentTurn = this.store.selectSnapshot(TurnState.getTurn);
    const idPlayer = this.store.selectSnapshot(TurnState.getCurrentPlayer);
    const players = this.store.selectSnapshot(PlayerState.getPlayers);
    
    if (!players[idPlayer].human) {
      if(currentTurn.isPlayerEndOfTurn) {        
        this.clickApplyLife();
      }
      else {
        this.pickCell(idPlayer, players[idPlayer]);
      }
    }    
  }

  private pickCell(idPlayer: number, player: Player) {        
    const halfCell = this.store.selectSnapshot(TurnState.getHalfCell);
    const board = this.store.selectSnapshot(BoardState.getBoardCells);
    const pickedCell = BasicIA.play(board, idPlayer, player, halfCell);    
    this.store.dispatch(new AttributeCell(pickedCell));
  }

  private clickApplyLife() {    
    this.store.dispatch(new ApplyLife());    
  }
}