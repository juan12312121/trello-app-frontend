import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarLista } from './agregar-lista';

describe('AgregarLista', () => {
  let component: AgregarLista;
  let fixture: ComponentFixture<AgregarLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
