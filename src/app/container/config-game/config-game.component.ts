import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GameLogic } from '../../engine/logic';
import { CreateBoard, BoardReset } from '../../actions/board.action';
import { SetName, PlayerReset } from '../../actions/players.action';
import { TurnReset } from '../../actions/turn.action';
import { CleanSavePoints } from '../../actions/savepoint.action';
import { UIReset } from '../../actions/ui.action';
import { GameStateModel, GameState } from '../../state/game.state';
import { StopGame, StartGame } from '../../actions/game.action';
import { Observable } from 'rxjs';
import { IAState, IAStateModel } from '../../state/ia.state';


@Component({
  selector: 'app-config-game',
  templateUrl: './config-game.component.html',
  styleUrls: ['./config-game.component.css']
})
export class ConfigGameComponent implements OnInit {  
  @Select(GameState.getGameState) game$: Observable<GameStateModel>;
  @Select(IAState.getIAState) ia$: Observable<boolean>;
  
  isStoppedGame: boolean = false;
  game: GameStateModel = null;
  ia: boolean = false;
   
  constructor(private store: Store) { }

  ngOnInit() {  
    this.game$.subscribe(currentGame => this.game = currentGame);
    this.ia$.subscribe(runningIA => this.ia = runningIA); 
  }

  ngOnChanges(changes) {
    if (this.game != null) {
      if(changes.iaIsProcessing && !changes.iaIsProcessing.currentValue.iaIsProcessing === true) {
        if(this.game.isStoppingGame == GameStateModel.STOP_REQUEST) {
          this.onGameStopped();    
        }
      }
    }
  }

  onGameStopped() {
    this.store.dispatch(new StopGame(GameStateModel.STOP_DONE));
  }

  onSubmit($event) {
    if($event.newGame) {
      this.createGame($event.blue, $event.red);
    }    
    else {
      this.stopGame();
    }
  }

  stopGame() {
    this.store.dispatch(new StopGame(GameStateModel.STOP_REQUEST));
  }

  createGame(blueName: string, redName: string) {
    this.store.dispatch(new TurnReset());    
    this.store.dispatch(new PlayerReset());
    this.store.dispatch(new BoardReset());
    this.store.dispatch(new CleanSavePoints());
    this.store.dispatch(new UIReset());

    this.store.dispatch(new SetName(GameLogic.BLUE_PLAYER, blueName));
    this.store.dispatch(new SetName(GameLogic.RED_PLAYER, redName));
    this.store.dispatch(new CreateBoard(20));
    this.store.dispatch(new StartGame());
  }  
}