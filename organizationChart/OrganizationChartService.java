package kr.or.nextit.groupware.organizationChart;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OrganizationChartService {

    private final OrganizationChartMapper mapper;

    public List<TeacherVO> selectTeacher(String director, String teacher) {
        return mapper.selectTeacher(director, teacher);
    }
}
