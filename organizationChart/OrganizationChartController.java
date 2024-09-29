package kr.or.nextit.groupware.organizationChart;

import kr.or.nextit.groupware.board.BoardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class OrganizationChartController {

    private final OrganizationChartService service;

    public OrganizationChartController(OrganizationChartService service) {
        this.service = service;
    }

    @GetMapping("/organization-chart")
    public Map<String, Object> selectTeacher (@RequestParam(name = "director") String director, @RequestParam(name = "teacher") String teacher) {

        List<TeacherVO> teachers = service.selectTeacher(director, teacher);

        if(teachers != null) {
            return Map.of("teachers", teachers);
        } else {
            return Map.of("result", "failure");
        }
    }

}
