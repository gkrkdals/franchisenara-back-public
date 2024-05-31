import { Announcement } from 'src/model/announcement/announcement';

export class AnnouncementResponseDto {
  totalPage: number;
  announcements: Announcement[];
}