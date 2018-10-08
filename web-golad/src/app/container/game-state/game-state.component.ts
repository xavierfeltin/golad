import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CreateBoard, ApplyLife } from '../../actions/board.action';

@Component({
  selector: 'app-game-state',
  templateUrl: './game-state.component.html',
  styleUrls: ['./game-state.component.css']
})
export class GameStateComponent implements OnInit {

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
