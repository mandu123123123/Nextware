import React, {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";

function NewHomework() {
    const location = useLocation();
    const history = useHistory();
    const {lectureNo, cohortsId} = location.state || {};
    const [problems, setProblems] = useState([{ cohortsId: cohortsId, title: '', type: 'choice', options: ['']}]);
    const [mainTitle, setMainTitle] = useState('');
    const [mainContent, setMainContent] = useState('');
    const [userId, setUserId] = useState({});


    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setUserId(cookie.userId || 'No cookie found');
    }, []);

    // 문제 추가 함수
    const addProblem = () => {
        setProblems([...problems, { cohortsId: cohortsId, title: '', type: 'choice', options: [''] }]);
    };

    // 문제 삭제 함수
    const removeProblem = (index) => {
        setProblems(problems.filter((_, i) => i !== index));
    };

    // 문제 내용 변경 함수
    const handleProblemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProblems = problems.map((problem, i) =>
            i === index ? { ...problem, [name]: value } : problem
        );
        setProblems(updatedProblems);
    };


    const [errors, setErrors] = useState({});
    // 과제 제출 함수
    const handleSubmit = async () => {

        const newErrors = {};

        // 필드 유효성 검사
        if (!mainTitle) newErrors.mainTitle = '과제명을 입력해주세요.';
        if (!mainContent) newErrors.mainContent = '과제 내용을 입력해주세요.';
        problems.forEach((problem, i) => {
            if(!problem.title){
                newErrors.title = '입력되지 않은 문제가 있습니다..';
            }
            problem.options.forEach((option)=>{
                if(!option && problem.type === "choice"){
                    newErrors.option = '입력되지 않은 답안이 있습니다.';
                }
            })
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors); // 오류 메시지 설정
            alert(Object.values(newErrors)[0]);
        } else {
            setErrors({});
            try {
                // 과제 데이터 생성
                const homework = { cohortsId: cohortsId, lectureNo:lectureNo, userId: userId, mainTitle: mainTitle, mainContent: mainContent, problems: problems };

                // 서버로 데이터 전송
                const res = await axios.post('/insertHomework', {homework: homework});
                if(res.data === "success"){
                    alert("과제 등록 완료");
                    history.goBack();
                }

            } catch (error) {
                console.error('등록 중 오류가 발생했습니다:', error);
            }
        }
    };

    const handleTypeChange = (index, e) =>{
        const { name, value } = e.target;
        if(value === 'choice') {
            const updatedProblems = problems.map((problem, i) =>
                i === index ? { ...problem, [name]: value } : problem
            );
            setProblems(updatedProblems);
        }
        if(value === 'short') {
            const updatedProblems = problems.map((problem, i) =>
                i === index ? { ...problem, [name]: value } : problem
            );
            setProblems(updatedProblems);
        }
    }

    const handleOptionChange = (problemIndex, optionIndex, e) => {
        const updatedOptions = problems[problemIndex].options.map((option, i) =>
            i === optionIndex ? e.target.value : option
        );
        const updatedProblems = problems.map((problem, i) =>
            i === problemIndex ? { ...problem, options: updatedOptions } : problem
        );
        setProblems(updatedProblems);
    };

    const addOption = (problemIndex) => {
        const updatedProblems = problems.map((problem, i) =>
            i === problemIndex ? { ...problem, options: [...problem.options, ''] } : problem
        );
        setProblems(updatedProblems);
    };

    const removeOption = (problemIndex, optionIndex) => {
        const updatedOptions = problems[problemIndex].options.filter((_, i) => i !== optionIndex);
        const updatedProblems = problems.map((problem, i) =>
            i === problemIndex ? { ...problem, options: updatedOptions } : problem
        );
        setProblems(updatedProblems);
    };

    return (
        <div className="p-4 mb-8" style={{fontFamily: "Pretendard-Regular"}}>
            <div className="flex justify-center mt-4" style={{fontFamily: "Pretendard-Regular"}}>
                <p className="text-3xl">과제 등록</p>
            </div>
            <p className="border mt-6 mb-4"></p>

            {/*<div className="flex justify-end">*/}
            {/*    <button onClick={handleSubmit}*/}
            {/*            className="bg-green-400 text-white text-base rounded-lg px-4 py-2 font-thin mb-4">등록*/}
            {/*    </button>*/}
            {/*</div>*/}
            <div className="flex justify-end">
                <button onClick={handleSubmit}
                        className="mr-2 bg-blue-400 hover:bg-blue-500 text-white text-base rounded-lg px-6 py-2 font-thin mb-4">등록
                </button>
            </div>


            <div className="bg-gray-100 mb-8 p-4 flex flex-col rounded-lg">
                <input type="text" className="rounded-lg bg-white border-none mb-4" placeholder="과제 제목"
                       value={mainTitle} onChange={(e) => setMainTitle(e.target.value)}/>
                <textarea className="rounded-lg bg-white border-none p-3" placeholder="과제 내용"
                          value={mainContent} onChange={(e) => setMainContent(e.target.value)}></textarea>
            </div>
            <p className="border border-dashed mt-6 mb-8"></p>

            <button onClick={addProblem}
                    className="ml-2 mb-4 bg-blue-300 hover:bg-blue-400 text-white text-base rounded-lg px-4 py-2 font-thin">문제 추가
            </button>

            {problems.map((problem, index) => (
                <div key={index} className="border border-dashed bg-white mb-4 flex flex-col items-end p-5 rounded-lg">
                    {/*<h3>문제 {index + 1}</h3>*/}
                    <div className="flex flex-row w-full gap-2">
                        <input
                            type="text"
                            name="title"
                            value={problem.title}
                            onChange={(e) => handleProblemChange(index, e)}
                            placeholder={"문제 " + (index + 1)}
                            className="rounded-lg bg-gray-100 border-none mb-4 p-4 w-full"
                        />

                        <select className="rounded-lg bg-gray-100 border-none mb-4 p-2 w-64"
                                value={problem.type}
                                name="type"
                                onChange={(e) => handleTypeChange(index, e)}>
                            <option value="choice">객관식</option>
                            <option value="short">단답형</option>
                        </select>
                    </div>


                    <div className="flex justify-start w-full">
                        {problem.type === "choice" && (
                            <div className="flex flex-col w-full">
                                {problem.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center mb-3">
                                            <input type="radio" name={`radio-${index}`} value="" disabled/>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                                className="border-none ml-2 focus:shadow-bottom bg-gray-100 rounded-lg w-full p-2"
                                                placeholder={`답안 ${optionIndex + 1}`}
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
                                        className="flex flex-row items-center mt-2 mb-2">
                                    + 답안 추가
                                </button>
                            </div>
                        )}
                        {problem.type === "short" && (
                            <input
                                type="text"
                                placeholder="단답형 답안"
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
            {/*<button onClick={addProblem}*/}
            {/*        className="bg-green-400 text-white text-base rounded-lg px-4 py-2 font-thin">문제추가*/}
            {/*</button>*/}

        </div>
    );
}

export default NewHomework;
