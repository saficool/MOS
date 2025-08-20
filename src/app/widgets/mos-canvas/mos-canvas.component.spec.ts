import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosCanvasComponent } from './mos-canvas.component';

describe('MosCanvasComponent', () => {
  let component: MosCanvasComponent;
  let fixture: ComponentFixture<MosCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
