import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCandidatoComponent } from './ficha-candidato.component';

describe('FichaCandidatoComponent', () => {
  let component: FichaCandidatoComponent;
  let fixture: ComponentFixture<FichaCandidatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaCandidatoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
