import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeReviewComponent } from './trade-review.component';

describe('TradeReviewComponent', () => {
  let component: TradeReviewComponent;
  let fixture: ComponentFixture<TradeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
