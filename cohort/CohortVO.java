package kr.or.nextit.groupware.cohort;

import lombok.Data;

import java.time.LocalDate;
@Data
public class CohortVO {
    private int cohortsId;
    private String userName;
    private String cohortsName;
    private LocalDate startDate;
    private LocalDate endDate;
}
