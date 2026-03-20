import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearTarjeta } from './modal-crear-tarjeta';

describe('ModalCrearTarjeta', () => {
  let component: ModalCrearTarjeta;
  let fixture: ComponentFixture<ModalCrearTarjeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearTarjeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearTarjeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
