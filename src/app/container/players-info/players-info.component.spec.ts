import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersInfoComponent } from './players-info.component';

describe('PlayersInfoComponent', () => {
  let component: PlayersInfoComponent;
  let fixture: ComponentFixture<PlayersInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
