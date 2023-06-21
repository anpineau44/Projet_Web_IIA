import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordTokenComponent } from './forgot-password-token.component';

describe('ForgotPasswordTokenComponent', () => {
  let component: ForgotPasswordTokenComponent;
  let fixture: ComponentFixture<ForgotPasswordTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordTokenComponent]
    });
    fixture = TestBed.createComponent(ForgotPasswordTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
