package kr.or.nextit.groupware.commute;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CommuteController {
  private final CommuteService service;
  public CommuteController(CommuteService service) {
    this.service = service;
  }

  @PostMapping("/commute/selects")
  public Map<String, Object> selectsCommute(@RequestBody CommuteVO commute){
    System.out.println(commute);
    int offset = (commute.getCurrentPage() - 1) * commute.getPerPage();
    System.out.println(offset);
    List<CommuteVO> commutes = service.selectsCommute(commute.getUserId(), offset, commute.getPerPage());

    long totalCountCommutes = service.totalCountCommutes(commute.getUserId());

    if(commutes != null) {
      return Map.of("commutes", commutes ,"totalCount", totalCountCommutes);
    } else {
      return Map.of("result", "failure");
    }
  }

//  수정 시작
  @PostMapping("/arrive")
  public int arrive(@RequestBody CommuteVO commute, @RequestParam("arriveTime") String arriveTime){
    String userId = commute.getUserId();
    return service.arrive(userId,arriveTime);
  }

  @PostMapping("/leave")
  public int leave(@RequestBody CommuteVO commute, @RequestParam("leaveTime") String leaveTime, @RequestParam("arriveTime") String arriveTime){
    String userId = commute.getUserId();
    String arrive = arriveTime.substring(11);
    String leave = leaveTime.substring(11);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
    LocalTime nineOClock = LocalTime.of(9, 0, 59);
    LocalTime fullTime = LocalTime.of(17, 39, 59);

    LocalTime arriveFormat = LocalTime.parse(arrive, formatter);
    LocalTime leaveFormat = LocalTime.parse(leave, formatter);

    String status = "결석";

    if(arriveFormat.isAfter(nineOClock)) {
      status = "지각";
    }
    if(arriveFormat.isBefore(nineOClock) && leaveFormat.isBefore(fullTime)) {
      status = "조퇴";
    }
    if(arriveFormat.isBefore(nineOClock) && leaveFormat.isAfter(fullTime)) {
      status = "출석";
    }

    return service.leave(userId, leaveTime, status);
  }

  @GetMapping("/todayCommute")
  public CommuteVO todayCommute(@RequestParam("userId") String userId){
    System.out.println(service.getTodayCommute(userId));
    return service.getTodayCommute(userId);
  }

  @GetMapping("/countStatus")
  public Map<String, Integer> countStatus(@RequestParam("userId") String userId) {
    Map<String, Integer> statusCounts = new HashMap<>();

    int attendanceCount = service.countStatus(userId, "출석");
    int absenceCount = service.countStatus(userId, "결석");
    int leaveEarlyCount = service.countStatus(userId, "조퇴");
    int lateCount = service.countStatus(userId, "지각");

    int combinedLateAndLeave = leaveEarlyCount + lateCount;

    int totalAbsence = absenceCount + (combinedLateAndLeave / 3);

    statusCounts.put("attendance", attendanceCount);
    statusCounts.put("absence", absenceCount);
    statusCounts.put("leaveEarly", leaveEarlyCount);
    statusCounts.put("late", lateCount);
    statusCounts.put("totalAbsence", totalAbsence);

    return statusCounts;
  }

  @GetMapping("/countSame")
  public int countSameCohorts(@RequestParam("userId") String userId){
    return service.countSameCohorts(userId);
  }

  @GetMapping("/viewAttendance")
  public List<CommuteVO> findCommute(@RequestParam("userId") String userId, @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate){
    return service.findCommute(userId, startDate, endDate);
  }
}
