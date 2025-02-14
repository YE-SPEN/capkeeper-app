import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeProposalComponent } from './trade-proposal.component';

describe('TradeProposalComponent', () => {
  let component: TradeProposalComponent;
  let fixture: ComponentFixture<TradeProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeProposalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
