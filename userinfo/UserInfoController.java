package kr.or.nextit.groupware.userinfo;

import kr.or.nextit.groupware.board.BoardVO;
import kr.or.nextit.groupware.board.FileVO;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;


@RestController
public class UserInfoController {
    private final UserInfoService service;

    public UserInfoController(UserInfoService service) {
        this.service = service;
    }

    @GetMapping("/info/{userid}")
    public List<UserInfoVO> selectInfo(@PathVariable("userid") String userId) {
        System.out.println("useridCheck:" + userId);
        return service.selectInfo(userId);

    }

    @PostMapping("/info/{userid}")
    public String updateMember(@PathVariable("userid") String userId, @RequestBody UserInfoVO vo) {
        int update = service.updateInfo(vo);
        if (update > 0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @GetMapping("/selectTeacher")
    public UserInfoVO selectTeacherInfo(@RequestParam(name = "userId") String userId) {
        UserInfoVO userInfo = service.selectTeacherInfo(userId);
//        System.out.println("dd++" + userInfo); // 로그로 데이터 확인
        return userInfo;
    }

    @PostMapping("/insertTeacherInfo")
    public String insertTeacherInfo(@RequestBody UserInfoVO userInfo) {
        int TeacherInfo = service.insertTeacherInfo(userInfo);
        if (TeacherInfo > 0) {
            return "success";
        } else {
            return "fail";
        }
    }


    @PostMapping("/teacherUpdate")
    public String updateTeacherInfo(@RequestBody UserInfoVO userInfo) {
        int TeacherInfo = service.updateTeacherInfo(userInfo);
        if (TeacherInfo > 0) {
            return "success";
        } else {
            return "fail";
        }
    }


}
