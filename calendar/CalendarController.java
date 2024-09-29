package kr.or.nextit.groupware.calendar;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class CalendarController {
  private final CalendarService service;
  public CalendarController(CalendarService service) {
    this.service = service;
  }

  // 캘린더 등록
  @PostMapping("/calendar/insert")
  public String insertCalendar(@RequestBody CalendarVO calendar){ // 화면에서 post 방식으로 받은 데이터들을 calendar 파라미터에 담습니다.
    System.out.println(calendar);
    service.insertCalendar(calendar); // 함수와 이름이 같은 함수를 service에서 찾아서 데이터를 담은 calendar 파라미터를 보냅니다.
    return "Calendar inserted";
  }


  // 캘린더 조회
  @GetMapping("/calendar/selects")
  public List<CalendarVO> selectCalendars(){
    return service.selectCalendars(); // service로 보낼때: 전체조회이므로 파라미터 없이 service에서 함수와 이름이 같은 함수를 찾아서 실행합니다.
  }                                   // 화면으로 보낼때: url과 같은 url을 화면인 js 파일들에서 찾아서 데이터를 전달합니다.


  // 캘린더 수정
  @PostMapping("/calendar/update")
  public String updateCalendar(@RequestBody CalendarVO calendar){ // 화면에서 post 방식으로 받은 수정된 데이터들을 calendar 파라미터에 담습니다.
    System.out.println(calendar);
    service.updateCalendar(calendar); // 함수와 이름이 같은 함수를 service에서 찾아서 수정된 데이터를 담은 calendar 파라미터를 보냅니다.
    return "Calendar updated";
  }


  // 캘린더 삭제
  @GetMapping("/calendar/delete")
  public String deleteCalendar(@RequestParam("scheduleId") long scheduleId){ // 화면에서 get 방식으로 받은 스케줄 아이디를 scheduleId 파라미터에 담습니다.
    service.deleteCalendar(scheduleId); // 함수와 이름이 같은 함수를 service에서 찾아서 스케줄 아이디를 담은 scheduleId 파라미터를 보냅니다.
    return "calendar deleted";
  }

}

