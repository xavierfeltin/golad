import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
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
      case Game.EMPTY: {state = Game.RED_LVING; break;}
      case Game.RED_LVING: {state = Game.EMPTY; break;}
      case Game.RED_DYING: {state = Game.EMPTY; break;}
      case Game.RED_BORN: {state = Game.EMPTY; break;}
      default: {
        state = Game.EMPTY;
        break; 
      }
    }
    
    const cell: Cell = {
      id: pick.subMeshId,
      player: Game.RED_PLAYER,
      state: state
    };

    return cell;
  }
}