package kr.or.nextit.groupware.lecture;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface LectureMapper {

    List<LectureVO> selectLectures(String userId);

    List<LectureVO> selectTeacherLecture(String userId);

    List<LectureVO> getLectureList();

    List<Map> getCohortLectures();

    int addNewLectures(Map map);

    List<Map> getTeachers();

    int addNewLectureToCohort(Map map);

    int delLectureToCohort(Map map);

    int delLecture(Map map);
}
