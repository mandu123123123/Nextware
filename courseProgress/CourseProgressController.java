package kr.or.nextit.groupware.courseProgress;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class CourseProgressController {
    private final CourseProgressService service;

    public CourseProgressController(CourseProgressService service) { this.service = service; }

    @GetMapping("courseProgress")
    public List<CourseProgressVO> selectCourseProgress(@RequestParam("userId") String userId) {
        System.out.println(userId);
        return service.selectCourseProgress(userId);
    }

    @GetMapping("/courseAttendance")
    public List<CourseProgressVO> selectCourseAttendance(@RequestParam("userId") String userId) {
        System.out.println(userId);
        List<CourseProgressVO> courseProgressVOS = service.selectCourseAttendance(userId);
        System.out.println("과정" + courseProgressVOS);
        return courseProgressVOS;
    }

    @GetMapping("/countDate")
    public Map<String, Object> countDate(@RequestParam("userId") String userId){
        return service.countDate(userId);
    }
}