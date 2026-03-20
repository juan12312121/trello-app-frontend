import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaBanner } from './cta-banner';

describe('CtaBanner', () => {
  let component: CtaBanner;
  let fixture: ComponentFixture<CtaBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtaBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
