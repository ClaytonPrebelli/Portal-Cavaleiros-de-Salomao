import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaconComponent } from './macon.component';

describe('MaconComponent', () => {
  let component: MaconComponent;
  let fixture: ComponentFixture<MaconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
