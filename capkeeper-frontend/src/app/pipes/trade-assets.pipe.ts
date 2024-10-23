import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tradeAssetPipe'
})

export class TradeAssetPipe implements PipeTransform {
  transform(roster: any[], assetArr: any[], assetTypeFn: (asset: any) => string): any[] {
      if (!assetArr || assetArr.length === 0) {
          return roster;
      }

      return roster.filter(asset => {
          const assetType = assetTypeFn(asset); 

          if (assetType === 'player') {
              return !assetArr.some(player => player && player.player_id === asset.player_id);
          } else {
              return !assetArr.some(pick => pick && pick.asset_id === asset.asset_id);
          }
      });
  }
}


