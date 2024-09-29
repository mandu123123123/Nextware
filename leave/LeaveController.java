package kr.or.nextit.groupware.leave;

import kr.or.nextit.groupware.commute.CommuteVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
public class  LeaveController {
    private final LeaveService service;
    public LeaveController(LeaveService service) { this.service = service; }

//남은 휴가 계산( 수정 필요 )
    @GetMapping("/leaveSelects")
    public double selectLeaves(@RequestParam("userId") String userId) {
        System.out.println(userId);
        return service.selectLeaves(userId);
    }

//휴가 신청 조회
    @PostMapping("/select/application")
    public Map<String, Object> selectApplication(@RequestBody LeaveVO leave) {

        int offset = (leave.getCurrentPage() - 1) * leave.getPerPage();

        List<LeaveVO> leaveList = service.selectApplication(leave.getUserId(), offset, leave.getPerPage());
        long totalCountLeaves = service.totalCountLeaves(leave.getUserId());

        if(leaveList != null) {
            return Map.of("leaveList", leaveList , "totalCountLeaves", totalCountLeaves);
        } else {
            return Map.of("result", "failure");
        }
    }

//휴가 신청
    @PostMapping("/leaveInsert")
    public String insertLeave(@RequestBody LeaveVO leave) {
        int insertLeave = service.insertLeave(leave);

        return "Leave application inserted and leave days updated.";
    }

    @GetMapping("/viewLeave")
    public List<LeaveVO> viewLeaves() {
        return service.ViewLeaves();
    }

    @PostMapping("/updateApprove")
    public String updateApprove(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String state = (String) payload.get("state");
        String comment = (String) payload.get("comment");
        String leaveType = (String) payload.get("leaveType");
        System.out.println(leaveType);
        int leaveId = (Integer) payload.get("leaveId");

        service.approveLeave(state, comment, leaveId);

        if(Objects.equals(state, "Y")) {
            double leaveDays;
            if(leaveType.equals("L001")) {
                leaveDays = service.calculateLeaveDays(userId);
            }else{
                leaveDays = 0.5;
            }
            LeaveVO leave = new LeaveVO();
            leave.setLeaveId(leaveId);
            leave.setUserId(userId);
            leave.setLeaveDays(leaveDays);

            // 남은 휴가일 업데이트
            service.updateRemainingLeaveDays(userId, leaveDays);

            // 사용한 휴가일 업데이트
            service.updateUsedLeaveDays(userId, leaveDays);
        }

        return "update complete";
    }

    @GetMapping("/countApprove")
    public int countApprove() {
        return service.countState();
    }
}
