package kr.or.nextit.groupware.cohort;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CohortService {
    private final CohortMapper mapper;

    public List<CohortVO> selectCohorts() {
        return mapper.selectCohorts();
    }

    public CohortVO info(String userId){return mapper.info(userId);}

    public int updateCohortsInfo(CohortVO vo) {
        return mapper.updateCohortsInfo(vo);
    }

    public int createCohorts(CohortVO vo) {
        return mapper.createCohorts(vo);
    }

    public int deleteCohorts(int cohortsId) {
        return mapper.deleteCohorts(cohortsId);
    }
}
