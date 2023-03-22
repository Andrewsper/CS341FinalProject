import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YmcaModalComponent } from './ymca-modal.component';

describe('YmcaModalComponent', () => {
  let component: YmcaModalComponent;
  let fixture: ComponentFixture<YmcaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YmcaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YmcaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
