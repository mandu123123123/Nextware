package kr.or.nextit.groupware.lecture;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class LectureController {
    private final LectureService service;

    @PostMapping("/selectLecture")
    public List<LectureVO> selectLecture(@RequestBody Map map) {
        List<LectureVO> vo = service.selectLectures(map.get("userId").toString());
        return vo;
    }
    @PostMapping("/selectTeacherLecture")
    public List<LectureVO> selectTeacherLecture(@RequestBody Map map){
        List<LectureVO> vo = service.selectTeacherLecture(map.get("userId").toString());
        return vo;
    }

    @GetMapping("/getLectureList")
    public List<LectureVO> getLectureList(){
        List<LectureVO> list = service.getLectureList();
        return list;
    }

    @GetMapping("/getCohortLectures")
    public List<Map> getCohortLectures() {
        List<Map> cohortLectures = service.getCohortLectures();
        return cohortLectures;
    }

    @PostMapping("/addNewLectures")
    public String addNewLectures(@RequestBody Map map) {
        int i = service.addNewLectures((Map) map.get("createLecture"));
        if(i > 0){
            return "success";
        } else {
            return "fail";
        }
    }

    @GetMapping("/getTeachers")
    public List<Map> getTeachers() {
        List<Map> teachers = service.getTeachers();
        return teachers;
    }

    @PostMapping("/addNewLectureToCohort")
    public String addNewLectureToCohort(@RequestBody Map map) {
        System.out.println(map.get("item"));
        int i = service.addNewLectureToCohort((Map) map.get("item"));
        if(i > 0){
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/delLectureToCohort")
    public String delLectureToCohort(@RequestBody Map map) {
        int i = service.delLectureToCohort(map);
        if(i > 0){
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/delLecture")
    public String delLecture(@RequestBody Map map) {
        int i = service.delLecture(map);

        if(i > 0){
            return "success";
        } else {
            return "fail";
        }
    }

}
