import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadReciente } from './actividad-reciente';

describe('ActividadReciente', () => {
  let component: ActividadReciente;
  let fixture: ComponentFixture<ActividadReciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadReciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadReciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
