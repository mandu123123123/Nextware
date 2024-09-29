package kr.or.nextit.groupware.wealthManagement;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WealthManagementController {
    private final WealthManagementService service;
    public WealthManagementController(WealthManagementService service) {
        this.service = service;
    }

    @GetMapping("/selectWealths")
    public List<WealthManagementVO> selectWealthManagement() {
        return service.selectWealthManagement();
    }

    @GetMapping("/selectWealth")
    public WealthManagementVO selectWealth(@RequestParam("codeNo") int codeNo) {
        WealthManagementVO wealth = service.selectWealth(codeNo);
        return wealth;
    }

    @PostMapping("/insertWealth")
    public String insertWealthManagement(@RequestBody WealthManagementVO wealthManagement) {
       int insert =  service.insertWealthManagement(wealthManagement);
        if(insert > 0) {
            return "Insert Success";
        }else {
            return "Insert Fail";
        }
    }
    //수리하기
    @PostMapping("/breakDown")
    public String updateWealthBreakDown(@RequestBody WealthManagementVO wealthManagement) {
        int update = service.updateWealthBreakDown(wealthManagement);
        if(update > 0) {
            return "Update Success";
        }else{
            return "Update Fail";
        }
    }
    //수리완료
    @PostMapping("/inspection")
    public String updateWealthInspection(@RequestBody WealthManagementVO wealthManagement) {
        int update = service.updateWealthInspection(wealthManagement);
        if(update > 0) {
            return "Update Success";
        }else {
            return "Update Fail";
        }
    }

    // 여러 재물 삭제
    @PostMapping("/deleteWealths")
    public String deleteWealths(@RequestBody List<Integer> codeNos) {
        int deleteCount = service.deleteWealths(codeNos);  // 새로운 서비스 메서드 사용
        if (deleteCount == codeNos.size()) {
            return "Delete Success";
        } else {
            return "Delete Fail";
        }
    }

    //재물 정보 수정
    @PostMapping("updateWealth")
    public String updateWealth(@RequestBody WealthManagementVO wealthManagement) {
        int update = service.updateWealth(wealthManagement);
        if (update > 0) {
            return "Update Success";
        }else
        {
            return "Update Fail";
        }
    }
}
