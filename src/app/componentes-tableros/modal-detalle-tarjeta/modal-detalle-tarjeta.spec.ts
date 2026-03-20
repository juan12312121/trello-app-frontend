import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleTarjeta } from './modal-detalle-tarjeta';

describe('ModalDetalleTarjeta', () => {
  let component: ModalDetalleTarjeta;
  let fixture: ComponentFixture<ModalDetalleTarjeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleTarjeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleTarjeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
