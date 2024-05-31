import { CheckDetailClassifiedByBig } from 'src/model/add-check/check-detail';

export class CheckListResponseDTO {
  alreadyChecked: number;
  checkList: CheckDetailClassifiedByBig[]
}