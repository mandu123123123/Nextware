package kr.or.nextit.groupware.leave;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class LeaveVO {
    private int leaveId;
    private String leaveType;
    private String leaveName;
    private String userId;
    private double leaveDays;
    private int useLeaveDays;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String approveYn;
    private String approveComment;
    private LocalDate approveDate;
    private LocalDate applicateDate;
    private int currentPage;
    private int perPage;
}
