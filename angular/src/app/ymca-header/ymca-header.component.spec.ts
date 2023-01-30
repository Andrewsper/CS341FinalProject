import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YmcaHeaderComponent } from './ymca-header.component';

describe('YmcaHeaderComponent', () => {
  let component: YmcaHeaderComponent;
  let fixture: ComponentFixture<YmcaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YmcaHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YmcaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
