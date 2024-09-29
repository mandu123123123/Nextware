package kr.or.nextit.groupware.commute;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class CommuteVO {
  private long no;
  private String userId;
  private LocalDateTime arriveTime;
  private LocalDateTime leaveTime;
  private String status;
  private String date;
  private int currentPage;
  private int perPage;
  private int cnt;
}
