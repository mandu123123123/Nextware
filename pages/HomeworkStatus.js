import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useLocation} from "react-router-dom";

function HomeworkStatus() {
    const location = useLocation();
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const [question, setQuestion] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [comment, setComment] = useState('');
    const [score, setScore] = useState(0);
    const [selectStudentId, setSelectStudentId] = useState('');

    const {hwNo} = location.state || {};

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.post('/answerList', {hwNo}); // 과제 데이터 가져오기
                setAssignments(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };
        fetchAssignments();
    }, []);

    const handleSelectAssignment = async (studentId) => {
        const res = await axios.post("/answerData", {studentId, hwNo})
        setSelectedAssignment(res.data);
        setSelectStudentId(studentId);
        console.log(res.data);
    };

    const handleSubmitFeedback = async () => {
        // 피드백 제출 로직
        const res = await axios.post("/saveFeedback", {hwNo, studentId: selectStudentId, comment, score})
        console.log(res.data);
        if (res.data === "success") {
            alert("등록되었습니다.");
        } else {
            alert("이미 등록하셨습니다.")
        }
    };

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.post('/selectHomeworkQuestion/', {hwNo});
                setQuestion(res.data);
                setTitle(res.data[0].title);
                setContent(res.data[0].content);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchQuestion();
    }, [hwNo]);

    return (
        <div className="p-4 h-auto">
            {/*<h1 className="text-xl font-bold mb-4">제출된 과제 목록</h1>*/}
            <div className="flex justify-center mt-4" style={{fontFamily: "Pretendard-Regular"}}>
                <p className="text-3xl">제출 현황</p>
            </div>
            <p className="border mt-6 mb-10"></p>

            <div className="flex flex-row" style={{height: '43rem', fontFamily: "Pretendard-Regular"}}>
                <div className="bg-white p-4 rounded-lg shadow-md w-1/4 mr-2 h-auto overflow-auto">
                    <ul>
                        {assignments.map((assignment, index) => (
                            <li key={index} className="mb-4 flex flex-row justify-between">
                                <p className="text-gray-600">{assignment.NAME}</p>
                                <button onClick={() => handleSelectAssignment(assignment.STUDENT_ID)}
                                        className="bg-purple-300 hover:bg-purple-400 text-white rounded-lg w-20">상세 보기
                                </button>
                            </li>
                        ))}
                    </ul>

                </div>

                {selectedAssignment && (
                    <div className=" bg-gray-100 p-4 pt-0 rounded-lg shadow-md w-3/4 h-auto overflow-auto"
                         style={{fontFamily: "Pretendard-Regular"}}>
                        {/*<h2 className="text-lg font-semibold">{selectedAssignment.title}</h2>*/}
                        {/*<p className="text-gray-600">제출자: {selectedAssignment.NAME}</p>*/}
                        <div className="flex justify-between items-end">
                            <p className="text-gray-600 ml-2">제출일: {selectedAssignment[0].registerDate}</p>
                            <button onClick={handleSubmitFeedback}
                                    className="bg-blue-400 hover:bg-blue-500 text-white rounded-lg px-4 py-2 mt-4">피드백 제출
                            </button>
                        </div>
                        <div className="mt-4">
                            {/*<p className="text-gray-800">과제 내용:</p>*/}
                            {question.map((q, questionIndex) => (
                                <div key={questionIndex}
                                     className="bg-white border border-dashed flex flex-col mb-4 p-5 rounded-lg gap-2">
                                    <p>{questionIndex + 1} | {q.title}</p>
                                    {q.type === 'choice' && JSON.parse(q.values).map((choice, index) => (
                                        <label htmlFor={`option-${q.qno}-${index}`} key={index}>
                                            <input
                                                type="radio"
                                                id={`option-${q.qno}-${index}`}
                                                name={`group-${q.qno}`}
                                                className="mr-2"
                                                disabled
                                                checked={selectedAssignment.some(answer => (
                                                    q.qno === answer.qno && answer.answer === choice.option
                                                ))}
                                            />
                                            {choice.option}
                                        </label>
                                    ))}
                                    {q.type === 'short' && (
                                        <input
                                            type="text"
                                            className="border-gray-300 focus:bg-white focus:shadow-bottom bg-gray-50 rounded-lg"
                                            value={(() => {
                                                const answer = selectedAssignment.find(answer => answer.qno === q.qno);
                                                return answer ? answer.answer : '';
                                            })()}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-row gap-2 w-full mb-8">
                            <input
                                type="text"
                                className="border-gray-300 focus:bg-white focus:shadow-bottom bg-gray-50 rounded-lg w-full"
                                value={comment}
                                placeholder="추가 의견을 작성해주세요."
                                onChange={(e) => {
                                    setComment(e.target.value)
                                }}
                            />
                            <div
                                className="border focus:shadow-bottom bg-gray-50 rounded-lg w-32 flex justify-center items-center">
                                <input type="text"
                                       className="text-center border-none focus:shadow-bottom bg-gray-50 rounded-lg w-10"
                                       maxLength="3"
                                       value={score}
                                       onChange={(e) => {
                                           setScore(e.target.value)
                                       }}/><span className="pr-2">/ &nbsp;100</span>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default HomeworkStatus;