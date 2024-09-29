package kr.or.nextit.groupware.leave;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LeaveMapper {
    double selectLeaves(@Param("userId") String userId);

    List<LeaveVO> selectApplication(@Param("userId") String userId,  @Param("offset") int offset, @Param("perPage") int perPage);

    long totalCountLeaves(String userId);

    int insertLeave(LeaveVO leave);

    int calculateLeaveDays(@Param("userId") String userId);

    void updateRemainingLeaveDays(@Param("userId") String userId, @Param("leaveDays") double leaveDays);

    void updateUsedLeaveDays(@Param("userId") String userId, @Param("leaveDays") double leaveDays);

    List<LeaveVO> ViewLeaves();

    void approveLeave(@Param("state") String state, @Param("comment") String comment, @Param("leaveId") int leaveId);

    int countState();
}
