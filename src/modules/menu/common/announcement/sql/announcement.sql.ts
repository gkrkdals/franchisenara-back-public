export class AnnouncementSql {
  static getAnnouncementCount =
    'SELECT COUNT(*) cnt FROM sys100 WHERE corp = ? AND title LIKE ? AND gbn = 9';

  static getAnnouncement =
    `SELECT seq, ymd, gbn, title 
       FROM sys100 
      WHERE corp = ? 
        AND title LIKE ? 
        AND gbn = 9 
      ORDER BY seq DESC 
      LIMIT ?, 20`;

  static getIsThereNewAnnouncement =
    `SELECT seq FROM sys100 WHERE corp = ? AND show_start <= ? AND show_end >= ? ORDER BY ymd, seq DESC LIMIT 1`;

  static getTwoAnnouncements =
    `SELECT seq, title, ymd FROM sys100 WHERE corp = ? ORDER BY ymd DESC`;
}