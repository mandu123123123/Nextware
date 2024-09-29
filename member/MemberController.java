package kr.or.nextit.groupware.member;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class MemberController {
    private final MemberService service;
    public MemberController(MemberService service) {
        this.service = service;
    }
    @PostMapping("/register")
    public String insertMember(@RequestBody MemberVO vo) {
        int insertMember = service.insertMember(vo);
        if (insertMember > 0) {
            return "success";
        }
        return "fail";
    }

    @PostMapping("/check-email")
    public String checkEmail(@RequestBody Map map) {
        int findEmail = service.findByEmail(map.get("email").toString());
        if(findEmail > 0){
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody Map map) {
        int update = service.changePassword(map);
        if (update > 0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/findById")
    public String findById(@RequestBody Map map) {
        int findId = service.findUserId(map.get("userid").toString());
        if (findId > 0) {
            return "true";
        }
        return "false";
    }

    @PostMapping("/addStudent")
    public void addStudent(@RequestBody Map map) {

        service.addStudent(map);
        service.insertAttendance(map);
    }
    @PostMapping("/addTeacher")
    public void addTeacher(@RequestBody Map map) {
        String userId = map.get("teacherId").toString();
        String leaveType = "L001";

        service.addTeacher(map);
        service.insertLeave(leaveType, userId);
    }

    //관리자 페이지 추가
    @GetMapping("/management")
    public List<MemberVO> management() {
        return service.selectMembers();
    }

    @PostMapping("/management/{userId}")
    public String updateMember(@PathVariable("userId") String userId, @RequestBody MemberVO vo) {
        int update = service.updateMember(vo);
        if (update > 0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @DeleteMapping("/management/{userId}")
    public String deleteMember(@PathVariable("userId") String userId) {
        int delete = service.deleteMember(userId);
        if (delete > 0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @GetMapping("/getSignupList")
    public List<MemberVO> getSignupList() {
        return service.getSignupList();
    }

    @PostMapping("/changeApproval")
    public String changeApproval(@RequestBody Map map) {
        service.changeApproval((String) map.get("userid"));
        return "";
    }

    @PostMapping("/cancelApproval")
    public String cancelApproval(@RequestBody Map map) {
        service.cancelApproval((String) map.get("userid"));
        return "";
    }

    @PostMapping("/updateProfileImg")
    public String updateProfileImg(@RequestParam("file") MultipartFile file, @RequestParam("userId") String userId) {
        String upDir = "src/main/resources/static/profile";
        File directory = new File(upDir);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리 생성
        }

        String uploadDir = System.getProperty("user.dir");
        String path = "/src/main/resources/static/profile/";
        String filePath = uploadDir + path;
        String originalFileName = file.getOriginalFilename();
        double fileSize = file.getSize();

        String fileName = UUID.randomUUID().toString() + "_"+ originalFileName;

        try {
            // 파일 저장
            File dest = new File(filePath + fileName);
            file.transferTo(dest);
        } catch (IOException e) {
            e.printStackTrace();
        }

        Map map = new HashMap();
        map.put("userId",userId);
        map.put("filePath","/profile/"+ fileName);
        map.put("fileName",fileName);
        map.put("originalName",originalFileName);
        map.put("fileSize",fileSize);

        int uploaded = service.uploadProfileImage(map);
        if (uploaded > 0) {
            return "/profile/"+ fileName;
        } else {
            return "fail";
        }
    }

    @PostMapping("/insertProfileImage")
    public void insertProfileImage(@RequestBody Map map) {
        String upDir = "src/main/resources/static/profile";
        File directory = new File(upDir);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리 생성
        }

        String defaultFile = "/profile-icon.png";
        String userId = (String) map.get("createId");

        Map send = new HashMap();
        send.put("userId",userId);
        send.put("filePath",defaultFile);
        send.put("fileName",defaultFile);
        send.put("originalName",defaultFile);
        send.put("fileSize",0);

        service.insertProfileImage(send);
    }

    @PostMapping("/getProfileImage")
    public String getProfileImage(@RequestBody Map map) {
        String profileImage = service.getProfileImage((String) map.get("userId"));
        return profileImage;
    }
  
    @GetMapping("/getName")
    public String selectName(@RequestParam("userId") String userId){
        return service.selectName(userId);
    }
}
