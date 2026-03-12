import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaconsComponent } from './macons.component';

describe('MaconsComponent', () => {
  let component: MaconsComponent;
  let fixture: ComponentFixture<MaconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
