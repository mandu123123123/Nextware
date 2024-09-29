package kr.or.nextit.groupware.courseProgress;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class CourseProgressService {
    private final CourseProgressMapper mapper;

    public List<CourseProgressVO> selectCourseProgress(String userId){
        return mapper.selectCourseProgress(userId);
    }

    public List<CourseProgressVO> selectCourseAttendance(String userId){
        System.out.println(userId);
        return mapper.selectCourseAttendance(userId);
    }

    public Map<String, Object> countDate(String userId){
        return mapper.countDate(userId);
    }
}