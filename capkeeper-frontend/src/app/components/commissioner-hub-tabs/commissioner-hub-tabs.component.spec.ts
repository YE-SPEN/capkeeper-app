import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionerHubTabsComponent } from './commissioner-hub-tabs.component';

describe('CommissionerHubTabsComponent', () => {
  let component: CommissionerHubTabsComponent;
  let fixture: ComponentFixture<CommissionerHubTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionerHubTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionerHubTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
