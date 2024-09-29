package kr.or.nextit.groupware.commute;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommuteService {
  private final CommuteMapper mapper;
  public CommuteService(CommuteMapper mapper) {
    this.mapper = mapper;
  }

  public List<CommuteVO> selectsCommute(String userId, int offset, int perPage) {
    return mapper.selectsCommute(userId, offset, perPage);
  }

  public long totalCountCommutes(String userId) {
    return mapper.totalCountCommutes(userId);
  }

  public int arrive(String userId, String arriveTime) {return mapper.arrive(userId,arriveTime);}

  public int leave(String userId, String leaveTime, String status){return mapper.leave(userId,leaveTime,status);}

  public CommuteVO getTodayCommute(String userId) { return mapper.getTodayCommute(userId);}

  public int countStatus(String userId, String status){return mapper.countStatus(userId,status);}

  public int countSameCohorts(String userId){return mapper.countSameCohorts(userId);}

  public List<CommuteVO> findCommute(String userId, String startDate, String endDate){
    return mapper.findCommute(userId,startDate,endDate);
  }
}
