package kr.or.nextit.groupware.lecture;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class LectureVO {
    private int lectureNo;
    private String lectureName;
    private String teacherName;
    private int cohortsId;
    private String cohortsName;
    private LocalDate startDate;
    private LocalDate endDate;
}
