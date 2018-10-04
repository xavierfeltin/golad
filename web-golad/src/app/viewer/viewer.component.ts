import { Component, OnInit } from '@angular/core';
import { Game } from '../engine/game';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Create our game class using the render canvas element
    const game = new Game('renderCanvas');

    // Create the scene
    game.createScene();

    // start animation
    game.run();
  }
}
