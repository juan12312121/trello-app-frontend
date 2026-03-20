import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInvitar } from './modal-invitar';

describe('ModalInvitar', () => {
  let component: ModalInvitar;
  let fixture: ComponentFixture<ModalInvitar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInvitar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInvitar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
