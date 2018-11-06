import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { CounterState } from './state/counter.state';
import { BoardState } from './state/board.state';
import { EditCounterComponent } from './container/edit-counter/edit-counter.component';
import { DisplayCounterComponent } from './container/display-counter/display-counter.component';
import { GameVisualizerComponent } from './container/game-visualizer/game-visualizer.component';
import { ViewerComponent } from './container/viewer/viewer.component';
import { TurnInfoComponent } from './container/turn-info/turn-info.component';
import { TurnState } from './state/turn.state';
import { PlayerState } from './state/player.state';
import { PlayersInfoComponent } from './container/players-info/players-info.component';
import { ConfigGameComponent } from './container/config-game/config-game.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SavePointState } from './state/savepoint.state';
import { UIState } from './state/ui.state';
import { IAState } from './state/ia.state';
import { GameState } from './state/game.state';
import { FormCreateGameComponent } from './container/form-create-game/form-create-game.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    EditCounterComponent,
    DisplayCounterComponent,
    GameVisualizerComponent,
    TurnInfoComponent,
    PlayersInfoComponent,
    ConfigGameComponent,
    FormCreateGameComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([
      CounterState,
      BoardState,
      TurnState,
      PlayerState,
      SavePointState,
      UIState,
      IAState,
      GameState
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
