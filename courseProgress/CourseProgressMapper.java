package kr.or.nextit.groupware.courseProgress;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CourseProgressMapper {
    List<CourseProgressVO> selectCourseProgress(@Param("userId") String userId);

    List<CourseProgressVO> selectCourseAttendance(@Param("userId") String userId);

    Map<String, Object> countDate(@Param("userId") String userId);
}