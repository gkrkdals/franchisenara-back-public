export class JournalDetail {
  cus: string;
  gbn: string;
  emp_nm: string;
  bigo: string;
}

export class JournalRaw extends JournalDetail{
  ymd: string;
}

export class Journal {
  ymd: string;
  detail: JournalDetail[];
}