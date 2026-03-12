import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFamiliarComponent } from './modal-familiar.component';

describe('ModalFamiliarComponent', () => {
  let component: ModalFamiliarComponent;
  let fixture: ComponentFixture<ModalFamiliarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFamiliarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFamiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
