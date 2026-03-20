import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideInicio } from './aside-inicio';

describe('AsideInicio', () => {
  let component: AsideInicio;
  let fixture: ComponentFixture<AsideInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideInicio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideInicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
