package kr.or.nextit.groupware.member;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MemberVO {
    private String userId;
    private String authorityId;
    private String userPw;
    private String name;
    private String email;
    private String phone;
    private String address;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDate birth;
    private String gender;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDate registerDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDate modifiedDate;
    private String approval;
    private int cohortsId;
    private String cohortsName;
}
