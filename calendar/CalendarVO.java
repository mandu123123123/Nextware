package kr.or.nextit.groupware.calendar;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CalendarVO {
  private long scheduleId;
  private String scheduleType;
  private String title;
  private String content;
  private String writer;
  private LocalDate startDate;
  private LocalDate endDate;
}
