import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramModalComponent } from './program-modal.component';

describe('ProgramModalComponent', () => {
  let component: ProgramModalComponent;
  let fixture: ComponentFixture<ProgramModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
