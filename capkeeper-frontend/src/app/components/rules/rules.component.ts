import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { League } from '../../types';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css'
})
export class RulesComponent {
  league!: League;
  chapters: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false];

  constructor(
    public globalService: GlobalService
  ) { }

  ngOnInit(): void {
    if (this.globalService.league) {
      this.league = this.globalService.league;
      console.log(this.league)
    }
  }

  toggle(index: number) {
    this.chapters[index] = !this.chapters[index];
  }

}
