package kr.or.nextit.groupware.instructors;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InstructorsVO {
    private String userId;
    private String teacherId;
    private String name;
    private String tPosition;
    private String career;
    private String stack;
    private String record;
}
