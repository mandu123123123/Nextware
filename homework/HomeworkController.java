package kr.or.nextit.groupware.homework;

import kr.or.nextit.groupware.lecture.LectureVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class HomeworkController {
    private final HomeworkService service;

    @PostMapping("/selectHomeworks")
    public List<HomeworkVO> selectHomeworks(@RequestBody Map map){
        List<HomeworkVO> hwVo = service.selectHomeworks(map);
        return hwVo;
    }

    @PostMapping("/selectHomeworkQuestion/")
    public List<Map> selectHomeworkQuestion(@RequestBody Map map){
        List<Map> questionList = service.selectHomeworkQuestion((Integer) map.get("hwNo"));
        return questionList;
    }

    @PostMapping("/insertHomework")
    public String insertHomework(@RequestBody Map map){
        String insertHomework = service.insertHomework((Map) map.get("homework"));
        return insertHomework;
    }

    @PostMapping("/saveAnswers")
    public String saveAnswers(@RequestBody Map map){
        int i = service.saveAnswers(map);
        if(i > 0){
            return "success";
        }
        return "fail";
    }

    @PostMapping("/checkHomework")
    public String checkHomework(@RequestBody Map map){
        int checkHomework = service.checkHomework(map);
        if(checkHomework > 0){
            return "true";
        } else {
            return "false";
        }
    }

    @PostMapping("/updateHomework")
    public String updateHomework(@RequestBody Map map){
        System.out.println(map);
        int i = service.updateHomework(map);
        return "true";
    }

    @PostMapping("/deleteHomework")
    public String deleteHomework(@RequestBody Map map){
        int i = service.deleteHomework((Integer) map.get("hwNo"));
        if (i > 0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/answerList")
    public List<Map> answerList(@RequestBody Map map){
        List<Map> nameList = service.answerList((Integer) map.get("hwNo"));
        return nameList;
    }

    @PostMapping("/answerData")
    public List<Map> answerData(@RequestBody Map map){
        List<Map> maps = service.answerData(map);
        return maps;
    }

    @PostMapping("/saveFeedback")
    public String saveFeedback(@RequestBody Map map){
        int i = service.saveFeedback(map);
        if(i > 0){
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/checkFeedBack")
    public Map checkFeedback(@RequestBody Map map){
        return service.checkFeedBack(map);
    }
}
