import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCounterComponent } from './edit-counter.component';

describe('EditCounterComponent', () => {
  let component: EditCounterComponent;
  let fixture: ComponentFixture<EditCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
