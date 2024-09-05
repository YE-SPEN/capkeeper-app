import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuIsOpen: boolean = false;

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
    console.log('Menu toggled. Current state:', this.menuIsOpen); 
  }
}