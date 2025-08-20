import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosToolbarComponent } from './mos-toolbar.component';

describe('MosToolbarComponent', () => {
  let component: MosToolbarComponent;
  let fixture: ComponentFixture<MosToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
