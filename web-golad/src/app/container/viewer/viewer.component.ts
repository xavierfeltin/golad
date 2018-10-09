import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { GameLogic } from '../../engine/logic';
import { Game } from '../../engine/game';
import { Cell } from '../../models/cell.model';
import { AbstractMesh, PickingInfo } from 'babylonjs';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit, AfterViewInit {
  private game: Game;

  @Input() size: number = 0;  
  @Input() board: Cell[] = [];  
  @Output() pickObject = new EventEmitter();  

  constructor() {
  }

  ngOnInit() {      
  }

  ngAfterViewInit() {
    // Create our game class using the render canvas element
    this.game = new Game('renderCanvas');
    // Create the scene
    this.game.createScene();
    // start animation
    this.game.run();
  }

  ngOnChanges(changes) {    
    if (this.game) {
      if (changes.size) {
        this.game.createBoard(changes.size);
      }
      else if (changes.board) {
        this.game.updateBoard(changes.board.currentValue);
      }
    } 
  }

  onClick(event) {
    const correctedX = event.x - event.target.offsetLeft;
    const correctedY = event.y - event.target.offsetTop;
    const pickResult = this.game.onClickEvent(correctedX, correctedY);
    if (pickResult.hit) {
      this.pickObject.emit(this.generateCellFromMesh(pickResult));
    }
  }

  generateCellFromMesh(pick: PickingInfo): Cell {
    let state = -1;
    const mesh = pick.pickedMesh;
    const idMaterial = parseInt(mesh.material.id);
    switch(idMaterial) {
      case GameLogic.EMPTY: {state = GameLogic.RED_LIVING; break;}
      case GameLogic.RED_LIVING: {state = GameLogic.EMPTY; break;}
      case GameLogic.RED_DYING: {state = GameLogic.EMPTY; break;}
      case GameLogic.RED_BORN: {state = GameLogic.EMPTY; break;}
      default: {
        state = GameLogic.EMPTY;
        break; 
      }
    }
    
    const cell: Cell = {
      id: pick.subMeshId,
      player: GameLogic.RED_PLAYER,
      state: state
    };

    return cell;
  }
}