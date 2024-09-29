package kr.or.nextit.groupware.cohort;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CohortMapper {

    List<CohortVO> selectCohorts();

    CohortVO info(@Param("userId") String userId);

    int updateCohortsInfo(CohortVO vo);

    int createCohorts(CohortVO vo);

    int deleteCohorts(int cohortsId);
}
