import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { PlayerService } from '../../services/player.service';
import { SortingService } from '../../services/sorting.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Team, League, Player } from '../../types';

@Component({
  selector: 'app-player-database',
  templateUrl: './player-database.component.html',
  styleUrl: './player-database.component.css'
})

export class PlayerDatabaseComponent {
  modalRef!: BsModalRef;
  league_id!: string;
  allPlayers!: Player[];
  filteredPlayers!: Player[];
  teams!: Team[];

  constructor(
    private playerService: PlayerService,
    public globalService: GlobalService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.league_id = params.get('league_id')!;

      this.playerService.getAllPlayers(this.league_id)
        .subscribe(response => {
          this.allPlayers = response.players;
          this.filteredPlayers = response.players.filter(player => player['owned_by'] === null);
      });
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

}
