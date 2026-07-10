import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoPage } from './projeto.page';

describe('ProjetoPage', () => {
  let component: ProjetoPage;
  let fixture: ComponentFixture<ProjetoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
