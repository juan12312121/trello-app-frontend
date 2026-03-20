import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTablerosComponent } from './vista-tableros';

describe('VistaTablerosComponent', () => {
  let component: VistaTablerosComponent;
  let fixture: ComponentFixture<VistaTablerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaTablerosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaTablerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
