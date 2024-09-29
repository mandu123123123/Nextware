import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {useLocation} from "react-router-dom";

function Evaluation({setEvOpen, lectureNo, cohortsId, studentId}) {
    const [data, setData] = useState([]);

    const location = useLocation()
    const lectureName = location.state?.lectureName || {};

    const [list, setList] = useState([]);

    const transformData = (data) => {
        const groupedData = data.reduce((acc, curr) => {
            const { id, label, no, groupKey, value } = curr;

            if (!acc[label]) {
                acc[label] = {
                    id: id,
                    label: label,
                    groupKey: groupKey,
                    value: []
                };
            }

            acc[label].value.push({
                no: no,
                value: value
            });

            return acc;
        }, {});

        return Object.values(groupedData);
    };

    useEffect(() => {
        // API 호출로 데이터를 받아옴
        const fetchData = async () => {
            const res = await axios.get('/getEvaluations');
            setData(transformData(res.data));
            console.log(res.data);
        }

        fetchData();

    }, []);

    useEffect(()=>{
        console.log(data);
    },[data])

    const goSubmit = async () => {
        const res = await axios.post("/saveEvaluation",{lectureNo, studentId, cohortsId, list});
        alert("제출 되었습니다.");
        setEvOpen(false);
    }

    // const valueChangeHandler = useCallback((id, value) => {
    //     setList(data => {
    //         // 동일한 id를 가진 항목이 이미 존재하는 경우 필터링하여 제거
    //         const filteredData = data.filter(item => !item.hasOwnProperty(id));
    //         // 새로운 항목 추가
    //         return [...filteredData, { eqId: id, response: value }];
    //     });
    // }, []);

    const valueChangeHandler = useCallback((id, value) => {
        setList(data => {
            // 동일한 eqId를 가진 항목이 이미 존재하는 경우 해당 항목을 업데이트
            const updatedData = data.map(item =>
                item.eqId === id ? { ...item, response: value } : item
            );

            // 해당 eqId가 존재하지 않는 경우 새로운 항목 추가
            if (!updatedData.some(item => item.eqId === id)) {
                updatedData.push({ eqId: id, response: value });
            }

            return updatedData;
        });
    }, []);


    return (
        <div style={{fontFamily: "Pretendard-Regular"}}>
            <div className="bg-white p-4 rounded-lg">
                <div className="bg-white mb-4 flex flex-col p-5 rounded-lg">
                    <p className="font-bold text-3xl">{lectureName}</p>
                    <p>강의 만족도 조사</p>
                </div>
                {data.map((item, mainIndex) => (
                    <div key={mainIndex} className="bg-gray-50 border border-dashed flex flex-col mb-4 p-5 rounded-lg gap-2">
                        <p>{item.label}</p>
                        <div className="flex flex-row gap-2">
                            {item.groupKey === "ch001" && item.value.map((q, index) => (
                                <label htmlFor={`option-${mainIndex}-${q.no}`} key={index}>
                                    <input
                                        type="radio"
                                        id={`option-${mainIndex}-${q.no}`}
                                        name={item.id}
                                        className="mr-2 border"
                                        onChange={()=>{valueChangeHandler(item.id, q.value)}}
                                    />
                                    {q.value}
                                </label>
                            ))}
                        </div>
                        {item.groupKey === "ch002" && (
                            <input
                                type="text"
                                className="focus:bg-white border border-gray-300 focus:shadow-bottom bg-gray-50 rounded-lg"
                                placeholder={item.value[0].value}
                                onChange={(e)=>{valueChangeHandler(item.id, e.target.value)}}
                            />
                        )}
                    </div>
                ))}
                <div className="flex flex-row justify-end">
                    <button className="bg-green-400 text-white text-base rounded-lg px-4 py-2 font-thin"
                            onClick={goSubmit}>제출</button>
                </div>
            </div>
        </div>
    )
}

export default Evaluation;
