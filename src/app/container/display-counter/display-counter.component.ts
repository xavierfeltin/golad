import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterState } from '../../state/counter.state'; // We will use this shortly
import { Store, Select } from '@ngxs/store';

@Component({
  selector: 'app-display-counter',
  templateUrl: './display-counter.component.html',
  styleUrls: ['./display-counter.component.css']
})
export class DisplayCounterComponent implements OnInit {

  count: number;
  counter$: Observable<number>;

  constructor(private store: Store) { 
    this.counter$ = this.store.select(state => state.counter);
  }

  ngOnInit() {
    this.counter$.subscribe((newCount) => this.count = newCount);
  }

}
