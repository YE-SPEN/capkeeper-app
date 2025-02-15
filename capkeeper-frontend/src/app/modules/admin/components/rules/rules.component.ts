import { Component } from '@angular/core';
import { GlobalService } from '../../../../services/global.service';
import { League } from '../../../../types';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css',
  standalone: false
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

  anchorScroll(id: string): void {
    const element = document.getElementById(id);
    const yOffset = -75;
    
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
  
  

}
