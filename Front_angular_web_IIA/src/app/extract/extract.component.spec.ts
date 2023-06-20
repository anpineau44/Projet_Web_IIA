import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractComponent } from './extract.component';

describe('ExtractComponent', () => {
  let component: ExtractComponent;
  let fixture: ComponentFixture<ExtractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtractComponent]
    });
    fixture = TestBed.createComponent(ExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
