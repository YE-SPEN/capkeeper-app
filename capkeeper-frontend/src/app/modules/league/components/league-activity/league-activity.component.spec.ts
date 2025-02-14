import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueActivityComponent } from './league-activity.component';

describe('LeagueActivityComponent', () => {
  let component: LeagueActivityComponent;
  let fixture: ComponentFixture<LeagueActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
