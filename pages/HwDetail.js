import React, {useEffect, useState} from 'react';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@windmill/react-ui";

function HwDetail() {
    const location = useLocation();
    const history = useHistory();
    const {hwNo} = location.state || {};

    const [question, setQuestion] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [cookie, setCookie] = useState([]);
    const [answers, setAnswers] = useState({});
    const [userId, setUserId] = useState('');
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [feedBack, setFeedBack] = useState(null);

    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setCookie(cookie.authorityId || 'No cookie found');
        setUserId(cookie.userId || 'No cookie found')

        const fetchQuestion = async () => {
            const res = await axios.post('/checkHomework', {hwNo, userId});
            setShow(res.data);
        }

        fetchQuestion();
    }, [userId]);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.post('/selectHomeworkQuestion/', {hwNo});
                setQuestion(res.data);
                console.log(res.data);
                setTitle(res.data[0].mainTitle);
                setContent(res.data[0].content);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchQuestion();
    }, [hwNo]);

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionIndex]: value
        }));
    };

    const saveAnswer = async () => {
        try {
            const res = await axios.post('/saveAnswers', {hwNo, userId, answers});
            if (res.data === "success") {
                alert("제출 완료!");
                history.goBack();
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const deleteHw = async () => {
        const res = await axios.post('/deleteHomework', {hwNo});
        if (res.data === "success") {
            alert("삭제 완료!");
            history.goBack();
        }
    }

    const checkFeedBack = async () => {
        const res = await axios.post('/checkFeedBack', {hwNo, studentId: userId});
        if (res.data) {
            setOpen(true);
            setFeedBack(res.data);
        } else {
            alert("아직 점수가 등록되지 않았습니다.")
        }
    }

    return (
        <div className="flex flex-row gap-2 mb-8 h-auto" style={{fontFamily: "Pretendard-Regular"}}>
            <Modal isOpen={open} onClose={() => setOpen(false)} style={{fontFamily: "Pretendard-Regular"}}>
                <p className="mt-1 mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">최종 점수</p>
                {feedBack && feedBack.score} / 100
                <ModalHeader>추가 의견</ModalHeader>
                {feedBack && feedBack.comment}
            </Modal>
            <div className="bg-white shadow-lg p-4 mt-6 rounded-lg w-3/4">
                <div className="bg-gray-100 mb-4 flex flex-col p-5 rounded-lg">
                    <p className="text-3xl mb-1">{title}</p>
                    <p>{content}</p>
                </div>
                <p className="border mt-6 mb-6"></p>

                <div className="overflow-auto" style={{maxHeight: '39rem'}}>
                    {question.map((q, questionIndex) => (
                        <div key={questionIndex}
                             className="bg-gray-50 border border-dashed flex flex-col mb-4 p-5 rounded-lg gap-2">
                            <p>{questionIndex + 1} | {q.title}</p>
                            {q.type === 'choice' && JSON.parse(q.values).map((choice, index) => (
                                <label htmlFor={`option-${q.qno}-${index}`} key={index}>
                                    <input
                                        type="radio"
                                        id={`option-${q.qno}-${index}`}
                                        name={`group-${q.qno}-${choice.option}`}
                                        value={choice.option}
                                        checked={answers[q.qno] === choice.option}
                                        onChange={() => handleAnswerChange(q.qno, choice.option)}
                                        className="mr-2"
                                    />
                                    {choice.option}
                                </label>
                            ))}
                            {q.type === 'short' && (
                                <input
                                    type="text"
                                    className="border-gray-300 focus:bg-white focus:shadow-bottom bg-gray-50 rounded-lg"
                                    value={answers[q.qno] || ''}
                                    onChange={(e) => handleAnswerChange(q.qno, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>

            </div>
            <div className="bg-white p-2 mt-6 rounded-lg w-1/4 h-64 shadow-lg">
                <div className="bg-white p-4 pt-0 rounded-lg">
                    {cookie === 'A002' && (
                        <div className="w-full flex flex-col justify-end mt-6 gap-2">
                            <button
                                className="bg-pink-200 hover:bg-pink-100 mb-1 text-black text-base rounded-lg px-4 py-2 font-thin"
                                onClick={() => history.push(`/app/homeworkStatus/${hwNo}`, {hwNo})}>
                                제출 현황
                            </button>
                            <button
                                className="bg-yellow-200 hover:bg-yellow-100 mb-1 text-black text-base rounded-lg px-4 py-2 font-thin"
                                onClick={() => history.push(`/app/editHomework/${hwNo}`, {hwNo})}>
                                수정
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-200 mb-1 text-black text-base rounded-lg px-4 py-2 font-thin"
                                onClick={() => history.goBack()}>
                                목록
                            </button>
                            <button
                                className="bg-gray-400 hover:bg-gray-300 mb-1 text-white text-base rounded-lg px-4 py-2 font-thin"
                                onClick={deleteHw}>
                                삭제
                            </button>
                        </div>
                    )}
                    {cookie === 'A003' && (
                        <>
                            {show
                                ? (
                                    <div className="p-2">
                                        <div className="flex justify-between items-center">
                                            <button onClick={history.goBack} className="text-2xl">내 과제</button>
                                            <p className="p-2 text-blue-500">제출 완료</p>
                                        </div>
                                        <div className="border mt-3 mb-4"></div>
                                    </div>
                                )
                                : (
                                    <div className="p-2">
                                        <div className="flex justify-between items-center">
                                            <button onClick={history.goBack} className="text-2xl">내 과제</button>
                                            <p className="p-2 text-red-600">미제출</p>
                                        </div>
                                        <div className="border mt-3 mb-4"></div>
                                    </div>

                                )
                            }
                            <div className="w-full flex flex-col justify-end w-full gap-2">
                                <button
                                    className="bg-gray-300 mb-1 text-black text-base rounded-lg px-4 py-2 font-thin"
                                    onClick={() => history.goBack()}>
                                    목록
                                </button>
                                <button
                                    className="bg-green-400 mb-1 text-white text-base rounded-lg px-4 py-2 font-thin w-full"
                                    onClick={saveAnswer}
                                >
                                    제출
                                </button>
                                {/* 점수랑 피드백 등록시 등록된 화면으로 넘어가게 */}
                                <button onClick={checkFeedBack}
                                        className="bg-pink-200 mb-1 text-black text-base rounded-lg px-4 py-2 font-thin w-full"
                                >
                                    제출 결과 확인
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HwDetail;
