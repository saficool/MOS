import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosComponent } from './mos.component';

describe('MosComponent', () => {
  let component: MosComponent;
  let fixture: ComponentFixture<MosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
