package kr.or.nextit.groupware.lecture;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class LectureService {
    private final LectureMapper mapper;

    public List<LectureVO> selectLectures(String userId) {
        return mapper.selectLectures(userId);
    }

    public List<LectureVO> selectTeacherLecture(String userId) {
        return mapper.selectTeacherLecture(userId);
    }

    public List<LectureVO> getLectureList() {
        return mapper.getLectureList();
    }

    public List<Map> getCohortLectures() {
        return mapper.getCohortLectures();
    }

    public int addNewLectures(Map map) {
        return mapper.addNewLectures(map);
    }

    public List<Map> getTeachers() {
        return mapper.getTeachers();
    }

    public int addNewLectureToCohort(Map map) {
        return mapper.addNewLectureToCohort(map);
    }

    public int delLectureToCohort(Map map) {
        return mapper.delLectureToCohort(map);
    }

    @Transactional
    public int delLecture(Map map) {
        mapper.delLectureToCohort(map);
        int i = mapper.delLecture(map);
        if (i > 0) {
            return i;
        } else {
            return 0;
        }
    }
}
