import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnaLista } from './columna-lista';

describe('ColumnaLista', () => {
  let component: ColumnaLista;
  let fixture: ComponentFixture<ColumnaLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnaLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnaLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
