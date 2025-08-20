import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosResourceComponent } from './mos-resource.component';

describe('MosResourceComponent', () => {
  let component: MosResourceComponent;
  let fixture: ComponentFixture<MosResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosResourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
