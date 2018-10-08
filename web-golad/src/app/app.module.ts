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


@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    EditCounterComponent,
    DisplayCounterComponent,
    GameVisualizerComponent,
    GameStateComponent
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([
      CounterState,
      BoardState
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
