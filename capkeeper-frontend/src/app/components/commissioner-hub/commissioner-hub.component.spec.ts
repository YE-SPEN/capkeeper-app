import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionerHubComponent } from './commissioner-hub.component';

describe('CommissionerHubComponent', () => {
  let component: CommissionerHubComponent;
  let fixture: ComponentFixture<CommissionerHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionerHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionerHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
