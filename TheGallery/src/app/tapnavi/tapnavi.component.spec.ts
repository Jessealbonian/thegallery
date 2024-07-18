import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapnaviComponent } from './tapnavi.component';

describe('TapnaviComponent', () => {
  let component: TapnaviComponent;
  let fixture: ComponentFixture<TapnaviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TapnaviComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TapnaviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
