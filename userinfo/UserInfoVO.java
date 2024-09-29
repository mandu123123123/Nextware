package kr.or.nextit.groupware.userinfo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserInfoVO {
    private String userId;
    private String userPw;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private String address;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDate birth;
    private LocalDate modifiedDate;
    private String cohortsName;
    private String authorityId;
    private String teacherId;
    private String career;
    private String stack;
    private String record;
    private String tPosition;
}
