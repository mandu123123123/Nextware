package kr.or.nextit.groupware.wealthManagement;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WealthManagementService {
    private final WealthManagementMapper mapper;
    public WealthManagementService(WealthManagementMapper mapper) {this.mapper = mapper;}

    public List<WealthManagementVO> selectWealthManagement(){
        return mapper.selectWealthManagement();
    }
    public WealthManagementVO selectWealth(int codeNo){
        return mapper.selectWealth(codeNo);
    }
    public int insertWealthManagement(WealthManagementVO wealthManagement){
        return mapper.insertWealthManagement(wealthManagement);
    }
    public int updateWealthBreakDown(WealthManagementVO wealthManagement){
        return mapper.updateWealthBreakDown(wealthManagement);
    }

    public int updateWealthInspection(WealthManagementVO wealthManagement){
        return mapper.updateWealthInspection(wealthManagement);
    }
    public int deleteWealths(List<Integer> codeNos) {
        return mapper.deleteWealths(codeNos);  // 새로운 Mapper 메서드 호출
    }

    public int updateWealth(WealthManagementVO wealthManagement){
        return mapper.updateWealth(wealthManagement);
    }

}
