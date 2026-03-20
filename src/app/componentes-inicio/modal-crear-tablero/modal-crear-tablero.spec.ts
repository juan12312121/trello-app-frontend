import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearTablero } from './modal-crear-tablero';

describe('ModalCrearTablero', () => {
  let component: ModalCrearTablero;
  let fixture: ComponentFixture<ModalCrearTablero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearTablero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearTablero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
