export class AddCheckDto {
  cus: string;
  issue: string;
  data: {
    big: string;
    value: {
      sml: string;
      point: string;
      image: string;
    }[]
  }[]
}