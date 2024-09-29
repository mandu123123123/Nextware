package kr.or.nextit.groupware.cohort;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CohortController {
    private final CohortService service;
    @GetMapping("/selectCohorts")
    public List<CohortVO> selectCohorts() {
        List<CohortVO> cohortVOS = service.selectCohorts();
        return cohortVOS;
    }

    @GetMapping("/getInfo")
    public CohortVO info(@RequestParam("userId") String userId) {
        return service.info(userId);
    }

    @PostMapping("/updateCohortsInfo")
    public String updateCohortsInfo(@RequestBody CohortVO vo) {
        System.out.println(vo);
        int updateCohortsInfo = service.updateCohortsInfo(vo);
        if (updateCohortsInfo >0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/createCohorts")
    public String createCohorts(@RequestBody CohortVO vo) {
        System.out.println(vo);
        int created = service.createCohorts(vo);
        if (created >0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @PostMapping("/deleteCohorts")
    public String deleteCohorts(@RequestBody CohortVO vo) {
        System.out.println(vo);
        int deleted = service.deleteCohorts(vo.getCohortsId());
        if (deleted >0) {
            return "success";
        } else {
            return "fail";
        }
    }
}
