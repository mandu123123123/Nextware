package kr.or.nextit.groupware.courseAuthority;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CourseAuthorityController {
    private CourseAuthorityService service;
    public CourseAuthorityController(CourseAuthorityService service) {
        this.service = service;
    }
    @GetMapping("courseAuthority")
    public List<CourseAuthorityVO> selectCourseAuthority(@RequestParam("userId") String userId) {
        return service.selectsAuthority(userId);
    }
}
