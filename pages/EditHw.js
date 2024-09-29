import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

function EditHw() {
    const location = useLocation();
    const { hwNo } = location.state || {};
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [questions, setQuestions] = useState([]);
    const [deletedQuestions, setDeletedQuestions] = useState([]);
    const [deletedOptions, setDeletedOptions] = useState([]);

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                const res = await axios.post('/selectHomeworkQuestion/', { hwNo });
                const homework = res.data[0];
                setTitle(homework.title || '');
                setContent(homework.content || '');
                setQuestions(res.data.map(q => ({
                    ...q,
                    values: q.values ? JSON.parse(q.values) : [{ no: null, option: '' }]
                })));
            } catch (error) {
                console.error('Error fetching homework:', error);
            }
        };

        if (hwNo) fetchHomework(); // 처음에만 데이터를 가져오도록 설정
    }, [hwNo]);

    const handleSave = async () => {
        try {
            const formattedQuestions = questions.map(question => ({
                ...question,
                values: question.type === 'choice'
                    ? question.values.map(value => ({
                        no: value.no || null,
                        option: value.option || ''
                    }))
                    : [{ no: null, option: '' }] // 단답형의 경우 빈 배열
            }));

            const res = await axios.post('/updateHomework', {
                hwNo,
                title,
                content,
                questions: formattedQuestions,
                deletedQuestions,
                deletedOptions
            });
            if (res.data) {
                alert("수정 완료!");
                history.goBack();
            }
        } catch (error) {
            console.error('Error updating homework:', error);
        }
    };

    const handleQuestionChange = (index, e) => {
        const { name, value } = e.target;
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
            return updatedQuestions;
        });
    };

    const handleOptionChange = (questionIndex, optionIndex, e) => {
        const { value } = e.target;
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            const updatedValues = [...updatedQuestions[questionIndex].values];
            updatedValues[optionIndex] = {
                ...updatedValues[optionIndex],
                option: value
            };
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                values: updatedValues
            };
            return updatedQuestions;
        });
    };

    const addProblem = () => {
        setQuestions(prevQuestions => [
            ...prevQuestions,
            { hwNo: hwNo, qno: null, title: '', type: 'choice', values: [{ no: null, option: '' }] }
        ]);
    };

    const addOption = (questionIndex) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[questionIndex].values.push({ no: null, option: '' });
            return updatedQuestions;
        });
    };

    const removeOption = (questionIndex, optionIndex) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            const removedOption = updatedQuestions[questionIndex].values[optionIndex];
            setDeletedOptions(prevDeletedOptions => [...prevDeletedOptions, removedOption]);

            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                values: updatedQuestions[questionIndex].values.filter((_, idx) => idx !== optionIndex)
            };
            return updatedQuestions;
        });
    };

    const removeProblem = (index) => {
        setDeletedQuestions(prevDeleted => [...prevDeleted, questions[index]]);
        setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
    };

    return (
        <div className="p-4 mb-8" style={{ fontFamily: "Pretendard-Regular" }}>
            <div className="flex justify-center mt-4" style={{ fontFamily: "Pretendard-Regular" }}>
                <p className="text-3xl">과제 수정</p>
            </div>
            <p className="border mt-6 mb-4"></p>

            <div className="flex justify-end items-end">
                <button onClick={handleSave}
                        className="bg-blue-400 hover:bg-blue-500 text-white text-base rounded-lg px-6 py-2 font-thin mb-4 mr-2">저장
                </button>
            </div>

            <div className="bg-gray-100 mb-4 p-4 flex flex-col rounded-lg">
                <input type="text" className="rounded-lg bg-white border-none mb-4" placeholder="과제 제목"
                       value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea className="rounded-lg bg-white border-none p-3" placeholder="과제 내용"
                          value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <p className="border border-dashed mt-6 mb-8"></p>

            <button onClick={addProblem}
                    className="bg-blue-300 hover:bg-blue-400 text-white text-base rounded-lg px-4 py-2 font-thin mb-4 ml-2">문제 추가
            </button>
            {questions.map((question, index) => (
                <div key={index} className="bg-white border border-dashed mb-4 flex flex-col items-end p-5 rounded-lg">
                    <div className="flex flex-row w-full gap-2">
                        <input
                            type="text"
                            name="title"
                            value={question.title}
                            onChange={(e) => handleQuestionChange(index, e)}
                            placeholder={`질문 ${index + 1}`}
                            className="rounded-lg bg-gray-100 border-none mb-4 p-4 w-full"
                        />

                        <select className="rounded-lg bg-gray-100 border-none mb-4 p-2 w-64"
                                name="type"
                                value={question.type}
                                onChange={(e) => handleQuestionChange(index, e)}>
                            <option value="choice">객관식</option>
                            <option value="short">단답형</option>
                        </select>
                    </div>

                    <div className="flex justify-start w-full">
                        {question.type === "choice" && (
                            <div className="flex flex-col w-full">
                                {question.values.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center mb-2">
                                        <input type="radio" name={`radio-${index}`} value="" disabled />
                                        <input
                                            type="text"
                                            name="option"
                                            value={option.option}
                                            onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                            className="border-none ml-2 focus:shadow-bottom bg-gray-100 rounded-lg w-full p-2"
                                        />
                                        <button onClick={() => removeOption(index, optionIndex)} className="ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24"
                                                 height="24" viewBox="0 0 24 24">
                                                <path
                                                    d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addOption(index)}
                                        className="mt-2 mb-2 flex flex-row items-center">
                                    + 답안 추가
                                </button>
                            </div>
                        )}
                        {question.type === "short" && (
                            <input
                                type="text"
                                value=""
                                onChange={(e) => handleOptionChange(index, 0, e)}
                                placeholder="정답"
                                className="rounded-lg bg-gray-100 border-none mb-4 p-4 w-full"
                                disabled
                            />
                        )}
                    </div>
                    <button onClick={() => removeProblem(index)}
                            className="bg-red-300 hover:bg-red-400 text-white text-base rounded-lg px-4 py-2 font-thin">문제 삭제
                    </button>
                </div>
            ))}
        </div>
    );
}

export default EditHw;
