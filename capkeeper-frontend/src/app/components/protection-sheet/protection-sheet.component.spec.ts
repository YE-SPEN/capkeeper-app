import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectionSheetComponent } from './protection-sheet.component';

describe('ProtectionSheetComponent', () => {
  let component: ProtectionSheetComponent;
  let fixture: ComponentFixture<ProtectionSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectionSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
