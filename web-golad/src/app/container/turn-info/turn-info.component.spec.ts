import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnInfoComponent } from './turn-info.component';

describe('TurnInfoComponent', () => {
  let component: TurnInfoComponent;
  let fixture: ComponentFixture<TurnInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
