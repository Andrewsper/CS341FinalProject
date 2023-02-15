import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffHomePageComponent } from './staff-home-page.component';

describe('StaffHomePageComponent', () => {
  let component: StaffHomePageComponent;
  let fixture: ComponentFixture<StaffHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffHomePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
