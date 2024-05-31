import { Favorite } from 'src/model/add-order/favorite';

export class ModifyFavoriteDto {
  cus: string;
  newFavorites: Favorite[];
}