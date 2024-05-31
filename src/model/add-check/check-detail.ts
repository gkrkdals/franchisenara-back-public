
interface CheckDetailBig {
  big: string;
  big_nm: string;
}

interface CheckDetailSml {
  sml: string;
  sml_nm: string;
  memo1: string;
  memo2: string;
  file_nm: string;
}

export class CheckDetail implements CheckDetailBig, CheckDetailSml{
  big: string;
  big_nm: string;
  file_nm: string;
  memo1: string;
  memo2: string;
  sml: string;
  sml_nm: string;
}

export class CheckDetailClassifiedByBig {
  big: string;
  big_nm: string;
  value: CheckDetailSml[]
}