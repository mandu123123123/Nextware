package kr.or.nextit.groupware.homework;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class HomeworkService {
    private final HomeworkMapper mapper;

    public List<HomeworkVO> selectHomeworks(Map map) {
        return mapper.selectHomeworks(map);
    }

    public List<Map> selectHomeworkQuestion(int hwNo) {
        return mapper.selectHomeworkQuestion(hwNo);
    }

    @Transactional
    public String insertHomework(Map homework) {
        //과제 저장
        Map hwMap = new HashMap();
        hwMap.put("cohortsId", homework.get("cohortsId"));
        hwMap.put("lectureNo", homework.get("lectureNo"));
        hwMap.put("teacherId", homework.get("userId"));
        hwMap.put("title", homework.get("mainTitle"));
        hwMap.put("content", homework.get("mainContent"));
        mapper.insertHomework(hwMap);
//
//        //질문저장: HOMEWORK_ID, QUESTION, TYPE
//        mapper.insertQuestions((List) homework.get("problems"));

        List list = (List) homework.get("problems");
        for(Object o : list) {
            Map map = (Map) o;
            map.put("homeworkId", hwMap.get("hwNo"));
            mapper.insertQuestions(map);
            Map options = new HashMap();

            List optionList = (List) map.get("options");
            for(Object op : optionList) {
                options.put("qno", map.get("qno"));
                options.put("option", op);
                mapper.insertOptions(options);
            }
        }

        return "success";
    }

    public int saveAnswers(Map map) {
        Map answers = (Map) map.get("answers");
        int i = 0;
        for(Object o : answers.keySet()) {
            Map answer = new HashMap<>();
            answer.put("hwNo", map.get("hwNo"));
            answer.put("qno", o);
            answer.put("userId", map.get("userId"));
            answer.put("answer", answers.get(o));
            i += mapper.saveAnswers(answer);
        }
        if(i > 0 ){
            return i;
        } else {
            return 0;
        }
    }

    public int checkHomework(Map map) {
        int selectHw = mapper.checkHomework(map);
        return selectHw;
    }

//    @Transactional
//    public int updateHomework(Map map) {
//        Map hwMap = new HashMap();
//        hwMap.put("hwNo", map.get("hwNo"));
//        hwMap.put("title", map.get("title"));
//        hwMap.put("content", map.get("content"));
//        mapper.updateHomework(hwMap); // 과제 정보 업데이트
//
//        List<Map> questionsList = (List<Map>) map.get("questions");
//        for (Map questionMap : questionsList) {
//            questionMap.put("homeworkId", hwMap.get("hwNo"));
//
//            if (questionMap.get("qno") != null) {
//                mapper.updateQuestions(questionMap); // 기존 질문 업데이트
//            } else {
//                mapper.insertQuestions(questionMap); // 새로운 질문 삽입
//                int qno = (Integer) questionMap.get("qno");
//                questionMap.put("qno", qno);
//            }
//
//            List<Map> optionsList = (List<Map>) questionMap.get("values");
//            for (Map optionMap : optionsList) {
//                Object value = optionMap.get("value");
//
//                // value가 Map일 경우 내부 값을 추출
//                if (value instanceof Map) {
//                    value = ((Map) value).get("value");
//                    optionMap.put("value", value);
//                }
//
//                if (optionMap.get("no") != null) {
//                    mapper.updateOptions(optionMap); // 기존 옵션 업데이트
//                } else {
//                    optionMap.put("qno", questionMap.get("qno")); // 새로운 질문의 qno 사용
//                    mapper.insertOptions(optionMap); // 새로운 옵션 삽입
//                }
//            }
//        }
//        return 1;
//    }

//    @Transactional
//    public int updateHomework(Map map) {
//        Map hwMap = new HashMap();
//        hwMap.put("hwNo", map.get("hwNo"));
//        hwMap.put("title", map.get("title"));
//        hwMap.put("content", map.get("content"));
//        mapper.updateHomework(hwMap); // 과제 정보 업데이트
//
//        List<Map> questionsList = (List<Map>) map.get("questions");
//        for (Map questionMap : questionsList) {
//            questionMap.put("homeworkId", hwMap.get("hwNo"));
//
//            if (questionMap.get("qno") != null) {
//                mapper.updateQuestions(questionMap); // 기존 질문 업데이트
//            } else {
//                mapper.insertQuestions(questionMap); // 새로운 질문 삽입
//                // qno 값을 BigInteger로 받아 처리
//                BigInteger qno = (BigInteger) questionMap.get("qno");
//                questionMap.put("qno", qno.intValue()); // int 또는 Integer로 변환하여 사용
//            }
//
//            List<Map> optionsList = (List<Map>) questionMap.get("values");
//            for (Map optionMap : optionsList) {
////                Object value = optionMap.get("value");
//
////                // value가 Map일 경우 내부 값을 추출
////                if (value instanceof Map) {
////                    value = ((Map) value).get("value");
////                    optionMap.put("value", value);
////                }
//
//                if (optionMap.get("no") != null) {
//                    mapper.updateOptions(optionMap); // 기존 옵션 업데이트
//                } else {
//                    optionMap.put("qno", questionMap.get("qno")); // 새로운 질문의 qno 사용
//                    mapper.insertOptions(optionMap); // 새로운 옵션 삽입
//                }
//            }
//        }
//        return 1;
//    }

    @Transactional
    public int updateHomework(Map<String, Object> map) {
        // 과제 정보 업데이트
        Map<String, Object> hwMap = new HashMap<>();
        hwMap.put("hwNo", map.get("hwNo"));
        hwMap.put("title", map.get("title"));
        hwMap.put("content", map.get("content"));
        mapper.updateHomework(hwMap);

        // 삭제된 문제 처리
        List<Map<String, Object>> deletedQuestions = (List<Map<String, Object>>) map.get("deletedQuestions");
        for (Map<String, Object> questionMap : deletedQuestions) {
            mapper.deleteQuestion(questionMap);
        }

        List<Map<String, Object>> deletedOptions = (List<Map<String, Object>>) map.get("deletedOptions");
        for (Map<String, Object> optionMap : deletedOptions) {
            System.out.println(optionMap);
            mapper.deleteOption(optionMap);  // 옵션 삭제
        }

        // 질문 목록 가져오기
        List<Map<String, Object>> questionsList = (List<Map<String, Object>>) map.get("questions");
        for (Map<String, Object> questionMap : questionsList) {
            questionMap.put("homeworkId", hwMap.get("hwNo"));

            // 질문 업데이트 또는 삽입
            if (questionMap.get("qno") != null) {
                // 기존 질문 업데이트
                mapper.updateQuestions(questionMap);
            } else {
                // 새로운 질문 삽입
                mapper.insertQuestions(questionMap);

                // 새로 삽입된 질문의 qno를 가져오기
                BigInteger qno = (BigInteger) questionMap.get("qno");
                questionMap.put("qno", qno.intValue()); // int 또는 Integer로 변환
            }

            // 옵션 목록 가져오기
            List<Map<String, Object>> optionsList = (List<Map<String, Object>>) questionMap.get("values");
            for (Map<String, Object> optionMap : optionsList) {
                optionMap.put("qno", questionMap.get("qno")); // 질문의 qno를 옵션에 설정

                // 옵션 업데이트 또는 삽입
                if (optionMap.get("no") != null) {
                    // 기존 옵션 업데이트
                    mapper.updateOptions(optionMap);
                } else {
                    // 새로운 옵션 삽입
                    mapper.insertOptions(optionMap);
                }
            }
        }
        return 1;
    }


    public int deleteHomework(int hwNo) {
        return mapper.deleteHomework(hwNo);
    }

    public List<Map> answerList(int hwNo) {
        return mapper.answerList(hwNo);
    }

    public List<Map> answerData(Map map) {
        return mapper.answerData(map);
    }

    @Transactional
    public int saveFeedback(Map map) {
        System.out.println(map);
        Map map1 = mapper.checkFeedBack(map);
        if (map1 != null) {
            return 0;
        } else {
            return mapper.saveFeedback(map);
        }
    }

    public Map checkFeedBack(Map map) {
        return mapper.checkFeedBack(map);
    }
}
