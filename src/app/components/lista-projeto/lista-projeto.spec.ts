import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProjeto } from './lista-projeto';

describe('ListaProjeto', () => {
  let component: ListaProjeto;
  let fixture: ComponentFixture<ListaProjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProjeto],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
