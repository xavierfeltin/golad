import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { CounterState } from './state/counter.state';
import { BoardState } from './state/board.state';
import { EditCounterComponent } from './container/edit-counter/edit-counter.component';
import { DisplayCounterComponent } from './container/display-counter/display-counter.component';
import { GameVisualizerComponent } from './container/game-visualizer/game-visualizer.component';
import { GameStateComponent } from './container/game-state/game-state.component';
import { ViewerComponent } from './container/viewer/viewer.component';
import { TurnInfoComponent } from './container/turn-info/turn-info.component';
import { TurnState } from './state/turn.state';
import { PlayerState } from './state/player.state';


@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    EditCounterComponent,
    DisplayCounterComponent,
    GameVisualizerComponent,
    GameStateComponent,
    TurnInfoComponent
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([
      CounterState,
      BoardState,
      TurnState,
      PlayerState
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
