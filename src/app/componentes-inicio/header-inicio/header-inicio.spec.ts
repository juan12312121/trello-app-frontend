import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInicio } from './header-inicio';

describe('HeaderInicio', () => {
  let component: HeaderInicio;
  let fixture: ComponentFixture<HeaderInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderInicio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
