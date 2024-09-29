package kr.or.nextit.groupware.commute;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommuteMapper {
  List<CommuteVO> selectsCommute(@Param("userId") String userId, @Param("offset") int offset, @Param("perPage") int perPage);

  long totalCountCommutes(String userId);

//  뜯어 고치는중
  int arrive(@Param("userId") String userId, @Param("arriveTime") String arriveTime);

  int leave(@Param("userId") String userId, @Param("leaveTime") String leaveTime, @Param("status") String status);

  CommuteVO getTodayCommute(@Param("userId") String userId);

  int countStatus(@Param("userId") String userId, @Param("status") String status);

  int countSameCohorts(@Param("userId") String userId);

  List<CommuteVO> findCommute(@Param("userId") String userId, @Param("startDate") String startDate, @Param("endDate") String endDate);
}
