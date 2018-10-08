import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { IncrementCounter, DecrementCounter } from '../../actions/counter.action';

@Component({
  selector: 'app-edit-counter',
  templateUrl: './edit-counter.component.html',
  styleUrls: ['./edit-counter.component.css']
})
export class EditCounterComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
  }

  increment() {
    this.store.dispatch(new IncrementCounter());
  }

  decrement() {
    this.store.dispatch(new DecrementCounter());
  }
}
