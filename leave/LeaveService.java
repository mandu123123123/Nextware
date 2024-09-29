package kr.or.nextit.groupware.leave;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LeaveService {
    private final LeaveMapper mapper;

    public double selectLeaves(String userId){ return mapper.selectLeaves(userId); }

    public List<LeaveVO> selectApplication(String userId, int offset, int perPage){ return mapper.selectApplication(userId, offset, perPage); }

    public long totalCountLeaves(String userId) {
        return mapper.totalCountLeaves(userId);
    }

    public int insertLeave(LeaveVO leave){ return mapper.insertLeave(leave); }

    public int calculateLeaveDays(String userId){
        return mapper.calculateLeaveDays(userId);
    }

    public void updateRemainingLeaveDays(String userId, double leaveDays){
        mapper.updateRemainingLeaveDays(userId, leaveDays);
    }

    public void updateUsedLeaveDays(String userId, double leaveDays){
        mapper.updateUsedLeaveDays(userId, leaveDays);
    }

    public List<LeaveVO> ViewLeaves(){
        return mapper.ViewLeaves();
    }

    public void approveLeave(String  state, String comment, int leaveId){
        mapper.approveLeave(state, comment, leaveId);
    }

    public int countState(){
        return mapper.countState();
    }
}
