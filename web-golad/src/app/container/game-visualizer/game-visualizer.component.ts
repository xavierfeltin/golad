import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Cell } from '../../models/cell.model';
import { Observable } from 'rxjs';
import { AttributeCell } from '../../actions/board.action';

@Component({
  selector: 'app-game-visualizer',
  templateUrl: './game-visualizer.component.html',
  styleUrls: ['./game-visualizer.component.css']
})
export class GameVisualizerComponent implements OnInit {
  
  @Select(state => state.board.size) size$: Observable<number>;
  @Select(state => state.board.cells) cells$: Observable<Cell[]>;
  pickedName: string = '';

  constructor(private store: Store) {}

  ngOnInit() {}

  onPick(cell) {
    this.store.dispatch(new AttributeCell(cell, 0)); //cell + player    
  }
}