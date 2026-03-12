import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTokenComponent } from './modal-token.component';

describe('ModalTokenComponent', () => {
  let component: ModalTokenComponent;
  let fixture: ComponentFixture<ModalTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
