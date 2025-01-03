import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'draftOrderPipe'
})
export class DraftOrderPipe implements PipeTransform {
  transform(teams: any[], draftOrder: any[]): any[] {
    return teams.filter(team => !draftOrder.includes(team.team_id));
  }
}
