import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { GameLogic } from '../../engine/logic';
import { CreateBoard } from '../../actions/board.action';
import { SetName } from '../../actions/players.action';
import { TurnReset } from '../../actions/turn.action';


@Component({
  selector: 'app-config-game',
  templateUrl: './config-game.component.html',
  styleUrls: ['./config-game.component.css']
})
export class ConfigGameComponent implements OnInit {
  formConfig: FormGroup; 

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit() {
    this.formConfig = this.fb.group({
      blue_name: ['Blue', [
        Validators.required,
        Validators.minLength(1)
      ]],
      red_name: ['Red', [
        Validators.required,
        Validators.minLength(1)
      ]],            
    }); 
  }

  onSubmit(form: FormGroup) {        
    this.store.dispatch(new TurnReset());
    this.store.dispatch(new SetName(GameLogic.BLUE_PLAYER, form.value.blue_name));
    this.store.dispatch(new SetName(GameLogic.RED_PLAYER, form.value.red_name));
    this.store.dispatch(new CreateBoard(20));    
  }
}
