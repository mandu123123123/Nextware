package kr.or.nextit.groupware.homework;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface HomeworkMapper {

    List<HomeworkVO> selectHomeworks(Map map);

    List<Map> selectHomeworkQuestion(int hwNo);

    void insertHomework(Map homework);

    void insertQuestions(Map problems);

    void insertOptions(Map options);

    int saveAnswers(Map answer);

    int checkHomework(Map map);

    void updateHomework(Map hwMap);

    void updateQuestions(Map maps);

    void updateOptions(Map option);

    int deleteHomework(int hwNo);

    List<Map> answerList(int hwNo);

    List<Map> answerData(Map map);

    void deleteQuestion(Map map);

    void deleteOption(Map map);

    int saveFeedback(Map map);

    Map checkFeedBack(Map map);
}
