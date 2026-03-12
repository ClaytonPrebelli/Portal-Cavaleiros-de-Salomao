import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaMacomComponent } from './ficha-macom.component';

describe('FichaMacomComponent', () => {
  let component: FichaMacomComponent;
  let fixture: ComponentFixture<FichaMacomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaMacomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaMacomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
