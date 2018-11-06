import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateGameComponent } from './form-create-game.component';

describe('FormCreateGameComponent', () => {
  let component: FormCreateGameComponent;
  let fixture: ComponentFixture<FormCreateGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCreateGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
