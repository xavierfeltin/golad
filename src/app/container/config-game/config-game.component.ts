import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GameLogic } from '../../engine/logic';
import { CreateBoard, BoardReset } from '../../actions/board.action';
import { SetPlayer, PlayerReset } from '../../actions/players.action';
import { TurnReset } from '../../actions/turn.action';
import { CleanSavePoints } from '../../actions/savepoint.action';
import { UIReset } from '../../actions/ui.action';
import { GameStateModel, GameState } from '../../state/game.state';
import { StopGame, StartGame } from '../../actions/game.action';
import { Observable } from 'rxjs';
import { IAState, IAStateModel } from '../../state/ia.state';
import { Player } from '../../models/player.model';
import { TurnStateModel, TurnState } from '../../state/turn.state';
import { PlayerState } from '../../state/player.state';


@Component({
  selector: 'app-config-game',
  templateUrl: './config-game.component.html',
  styleUrls: ['./config-game.component.css']
})
export class ConfigGameComponent implements OnInit {  
  @Select(GameState.getGameState) game$: Observable<GameStateModel>;
  @Select(IAState.getIAState) ia$: Observable<boolean>;
  @Select(PlayerState.getPlayers) players$: Observable<Player[]>;
  @Select(TurnState.getTurn) turn$: Observable<TurnStateModel>;
  
  isStoppedGame: boolean = false;
  game: GameStateModel = null;
  players: Player[] = [];
  currentPlayer: number = GameLogic.NO_PLAYER;
  ia: boolean = false;
   
  constructor(private store: Store) { }

  ngOnInit() {  
    this.game$.subscribe(currentGame => this.game = currentGame);
    this.ia$.subscribe(runningIA => this.ia = runningIA); 
    this.players$.subscribe(players => this.players = [...players]); 
    this.turn$.subscribe(turn => this.currentPlayer = turn.currentPlayer); 
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
      this.createGame($event.blue, $event.red, $event.blue_player, $event.red_player);
    }    
    else {
      this.stopGame();
    }
  }

  stopGame() {
    if(this.players[this.currentPlayer].human) {
      this.store.dispatch(new StopGame(GameStateModel.STOP_DONE));
    }
    else {
      this.store.dispatch(new StopGame(GameStateModel.STOP_REQUEST));
    }    
  }

  createGame(blueName: string, redName: string, bluePlayer: string, redPlayer: string) {
    this.store.dispatch(new TurnReset());    
    this.store.dispatch(new PlayerReset());
    this.store.dispatch(new BoardReset());
    this.store.dispatch(new CleanSavePoints());
    this.store.dispatch(new UIReset());

    this.store.dispatch(new SetPlayer(GameLogic.BLUE_PLAYER, blueName, bluePlayer));
    this.store.dispatch(new SetPlayer(GameLogic.RED_PLAYER, redName, redPlayer));
    this.store.dispatch(new CreateBoard(20));
    this.store.dispatch(new StartGame());
  }  
}