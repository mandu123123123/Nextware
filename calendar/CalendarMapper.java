package kr.or.nextit.groupware.calendar;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CalendarMapper {

  int insertCalendar(CalendarVO calendar); // mapper-xml과 매핑하기 위한 인터페이스로, 함수와 이름이 같은 xml 파일들의 쿼리문의 아이디를 찾아서 service에서 받은 calendar 파라미터를 보냅니다.


  List<CalendarVO> selectCalendars(); // xml로 보낼때: 함수와 이름이 같은 xml 파일들의 쿼리문의 아이디를 찾아서 매핑합니다.
                                      // service로 보낼때: mapper-xml에서 조회한 데이터들을 받아서 함수와 이름이 같은 함수를 service에서 찾아서 데이터를 전달합니다.


  int updateCalendar(CalendarVO calendar); // 함수와 이름이 같은 xml 파일들의 쿼리문의 아이디를 찾아서 service에서 받은 calendar 파라미터를 보냅니다.


  int deleteCalendar(long scheduleId); // 함수와 이름이 같은 xml 파일들의 쿼리문의 아이디를 찾아서 service에서 받은 scheduleId 파라미터를 보냅니다.

}
