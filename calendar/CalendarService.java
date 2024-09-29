package kr.or.nextit.groupware.calendar;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarService {
  private final CalendarMapper mapper;
  public CalendarService(CalendarMapper mapper) {
    this.mapper = mapper;
  }

  public int insertCalendar(CalendarVO calendar) { // controller에서 받은 calendar 파라미터입니다.
    return mapper.insertCalendar(calendar); // 함수와 이름이 같은 함수를 mapper에서 찾아서 controller에서 받은 calendar 파라미터를 보냅니다.
  }


  public List<CalendarVO> selectCalendars() {
    return mapper.selectCalendars(); // mapper로 보낼때: 파라미터가 없으므로 mapper에서 함수와 이름이 같은 함수를 찾아서 실행합니다.
  }                                  // controller로 보낼때: 함수와 이름이 같은 함수를 controller에서 찾아서 데이터를 전달합니다.


  public int updateCalendar(CalendarVO calendar) { // controller에서 받은 calendar 파라미터입니다.
    return mapper.updateCalendar(calendar); // 함수와 이름이 같은 함수를 mapper에서 찾아서 controller에서 받은 calendar 파라미터를 보냅니다.
  }


  public int deleteCalendar(long scheduleId) { // controller에서 받은 scheduleId 파라미터입니다.
    return mapper.deleteCalendar(scheduleId); // 함수와 이름이 같은 함수를 mapper에서 찾아서 controller에서 받은 scheduleId 파라미터를 보냅니다.
  }

}
