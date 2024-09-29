package kr.or.nextit.groupware.wealthManagement;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WealthManagementMapper {
    List<WealthManagementVO> selectWealthManagement();
    WealthManagementVO selectWealth(@Param("codeNo")int codeNo);
    int insertWealthManagement(WealthManagementVO wealthManagementVO);
    int updateWealthBreakDown(WealthManagementVO wealthManagementVO);
    int updateWealthInspection(WealthManagementVO wealthManagementVO);
    int deleteWealths(List<Integer> codeNos);
    int updateWealth(WealthManagementVO wealthManagementVO);
}
