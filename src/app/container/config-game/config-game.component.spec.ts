import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigGameComponent } from './config-game.component';

describe('ConfigGameComponent', () => {
  let component: ConfigGameComponent;
  let fixture: ComponentFixture<ConfigGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
