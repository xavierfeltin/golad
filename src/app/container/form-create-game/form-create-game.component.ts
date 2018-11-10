import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { GameStateModel } from '../../state/game.state';
import { IAStateModel } from '../../state/ia.state';
import { GameLogic } from '../../engine/logic';

@Component({
  selector: 'app-form-create-game',
  templateUrl: './form-create-game.component.html',
  styleUrls: ['./form-create-game.component.css']
})
export class FormCreateGameComponent implements OnInit, OnChanges {

  @Input() game: GameStateModel = null;
  @Input() ia: IAStateModel = null;
  @Output() submitConfig: EventEmitter<{}> = new EventEmitter();
  @Output() gameStopped: EventEmitter<{}> = new EventEmitter();
  
  public labelHuman: string = GameLogic.HUMAN;
  public labelIA: string = GameLogic.IA;
  public configRandom: string = GameLogic.CONFIG_RANDOM;
  public configSquares: string = GameLogic.CONFIG_SQUARES;

  formConfig: FormGroup;  
  constructor(private fb: FormBuilder) { }

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
      red_player: [GameLogic.HUMAN, []],              
      blue_player: [GameLogic.HUMAN, []],
      board_configuration: [GameLogic.CONFIG_RANDOM, []]
    }); 
  }

  ngOnChanges(changes) {
    if (this.game != null) {
      if(changes.ia && !changes.ia.currentValue.iaIsProcessing === true) {
        if(this.game.isStoppingGame == GameStateModel.STOP_REQUEST) {
          this.gameStopped.emit();    
        }
      }
    }
  }

  onSubmit(form: FormGroup) {     
    const blueName = form.value.blue_name;
    const bluePlayer = form.value.blue_player;
    const redName = form.value.red_name;      
    const redPlayer = form.value.red_player;  
    const configuration = form.value.board_configuration;
 
    let formValues = {
      'newGame': false, 
      'blue': blueName, 
      'red': redName, 
      'blue_player': bluePlayer, 
      'red_player': redPlayer, 
      'board_configuration': configuration
    };

    formValues['newGame'] = !this.game.isGameOnGoing;
    this.submitConfig.emit(formValues);
    
    /*
    if (this.game.isGameOnGoing) {
            
      this.submitConfig.emit({'newGame': false, 'blue': blueName, 'red': redName, 'blue_player': bluePlayer, 'red_player': redPlayer, 'board_configuration': configuration});
    }            
    else {
      this.submitConfig.emit({'newGame': true, 'blue': blueName, 'red': redName, 'blue_player': bluePlayer, 'red_player': redPlayer, 'board_configuration': configuration});
    }
    */
  }
}
