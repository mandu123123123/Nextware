package kr.or.nextit.groupware.homework;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HomeworkVO {
    private int hwNo;
    private int lectureNo;
    private String teacherId;
    private String title;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
