import { Pipe, PipeTransform } from '@angular/core';
import { Team } from '../../../types';


@Pipe({
  name: 'draftOrderPipe',
  pure: false,
  standalone: false
})
export class DraftOrderPipe implements PipeTransform {
  transform(teams: Team[], draftOrder: (Team | null)[]): Team[] {
    if (!teams || !draftOrder) return teams;
    return teams.filter(team => 
      !draftOrder.some(selectedTeam => selectedTeam?.team_id === team.team_id)
    );
  }
}