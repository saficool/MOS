import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosContainerComponent } from './mos-container.component';

describe('MosContainerComponent', () => {
  let component: MosContainerComponent;
  let fixture: ComponentFixture<MosContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
