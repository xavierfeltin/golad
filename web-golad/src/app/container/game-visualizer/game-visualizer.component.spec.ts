import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameVisualizerComponent } from './game-visualizer.component';

describe('GameVisualizerComponent', () => {
  let component: GameVisualizerComponent;
  let fixture: ComponentFixture<GameVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
