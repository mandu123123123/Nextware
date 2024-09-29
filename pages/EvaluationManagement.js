import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import {Modal} from "@windmill/react-ui";

function EvaluationManagement() {
    const [cohorts, setCohorts] = useState([]);
    const [evaluationsMap, setEvaluationsMap] = useState({});
    const [responseCountsMap, setResponseCountsMap] = useState({});
    const [subjectiveResponsesMap, setSubjectiveResponsesMap] = useState({});
    const [open, setOpen] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/selectCohorts");
                setCohorts(res.data);
            } catch (error) {
                console.error("Cohorts 데이터를 불러오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, []);

    const groupByLectureName = (data) => {
        return data.reduce((result, item) => {
            const { LECTURE_NAME } = item;
            if (!result[LECTURE_NAME]) {
                result[LECTURE_NAME] = [];
            }
            result[LECTURE_NAME].push(item);
            return result;
        }, {});
    };

    const countResponsesByQuestion = (evaluations) => {
        const counts = {};
        const subjectiveResponses = {};
        evaluations.forEach((evaluation) => {
            const { CHOICE_ID, VALUE, LABEL } = evaluation;
            console.log("choice_id: ", CHOICE_ID);
            console.log("value: ", VALUE);
            console.log("label: ", LABEL);

            const predefinedAnswers = ["매우 그렇다", "그렇다", "보통이다", "그렇지 않다", "전혀 그렇지 않다"];

            if (predefinedAnswers.includes(VALUE)) {
                if (!counts[CHOICE_ID]) {
                    counts[CHOICE_ID] = { LABEL, responses: {} };
                }

                if (!counts[CHOICE_ID].responses[VALUE]) {
                    counts[CHOICE_ID].responses[VALUE] = 0;
                }

                counts[CHOICE_ID].responses[VALUE] += 1;
            } else if (VALUE != null && VALUE.trim() !== "") {
                if (!subjectiveResponses[CHOICE_ID]) {
                    subjectiveResponses[CHOICE_ID] = { LABEL, responses: [] };
                }
                subjectiveResponses[CHOICE_ID].responses.push(VALUE);
            }
        });

        return { counts, subjectiveResponses };
    };

    const goOpen = async (cohortsId) => {
        setOpen((prevState) => (prevState === cohortsId ? null : cohortsId));

        if (!evaluationsMap[cohortsId]) {
            const res = await axios.get(`/selectEvaluation?id=${cohortsId}`);
            const groupedEvaluations = groupByLectureName(res.data);

            const responseCounts = {};
            const subjectiveResponses = {};

            Object.keys(groupedEvaluations).forEach((lectureName) => {
                const { counts, subjectiveResponses: subResponses } = countResponsesByQuestion(
                    groupedEvaluations[lectureName]
                );
                responseCounts[lectureName] = counts;
                subjectiveResponses[lectureName] = subResponses;
            });

            console.log("groupedEvaluations: ",groupedEvaluations);
            console.log("responseCounts: ",responseCounts);
            console.log("subjectiveResponses: ",subjectiveResponses);

            setEvaluationsMap((prevMap) => ({
                ...prevMap,
                [cohortsId]: groupedEvaluations,
            }));

            setResponseCountsMap((prevMap) => ({
                ...prevMap,
                [cohortsId]: responseCounts,
            }));

            setSubjectiveResponsesMap((prevMap) => ({
                ...prevMap,
                [cohortsId]: subjectiveResponses,
            }));
        }
    };

    const formatChartData = (responses) => {
        const order = ["매우 그렇다", "그렇다", "보통이다", "그렇지 않다", "전혀 그렇지 않다"];

        return Object.entries(responses).flatMap(([choice_id, { LABEL, responses }]) => {
            const sortedResponses = order.map((value) => ({
                question: LABEL,
                answer: value,
                count: responses[value] || 0,
            }));
            console.log("sortedResponses",sortedResponses);
            return sortedResponses;
        });
    };

    return (
        <>
            <style>
                {`
                    .modal-content {
                    max-height: 80vh; /* 최대 높이 설정 */
                    overflow-y: auto; /* 스크롤이 필요할 때만 표시됨 */
                    }
                    .chat-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }

                    .chat-scrollbar::-webkit-scrollbar-track {
                        background: #ffffff;
                    }

                    .chat-scrollbar::-webkit-scrollbar-thumb {
                        background: #ffffff;
                        border-radius: 10px;
                    }

                    .chat-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #ffffff;
                    }

                    .chat-scrollbar::-webkit-scrollbar-button {
                        display: none;
                    }
                `}
            </style>
        <div className="text-gray-900 bg-white pt-8 pl-10 pr-10 mt-6 rounded-lg shadow-md" style={{fontFamily: "Pretendard-Regular", height: '50rem'}}>
            <Modal isOpen={open} onClose={()=>{setOpen(null)}} style={{width:'60%', maxWidth: '60%', height:'85%'}}>
                <div className="modal-content max-h-full overflow-y-auto p-4 chat-scrollbar">
                    {cohorts.map((item) => (
                        <div key={item.cohortsId}>
                            {evaluationsMap[item.cohortsId] &&
                                Object.keys(evaluationsMap[item.cohortsId]).map((lectureName) => (
                                    <div key={lectureName} className="mt-4 p-4 border rounded-lg">
                                        <h2 className="text-2xl mb-2">강의명: {lectureName}</h2>
                                        <div className="flex flex-wrap">
                                            {responseCountsMap[item.cohortsId] &&
                                                Object.keys(responseCountsMap[item.cohortsId][lectureName]).map(
                                                    (choice_id) => {
                                                        const {
                                                            LABEL,
                                                            responses,
                                                        } = responseCountsMap[item.cohortsId][lectureName][choice_id];
                                                        const chartData = formatChartData({
                                                            [choice_id]: {
                                                                LABEL,
                                                                responses,
                                                            },
                                                        });

                                                        return (
                                                            <div
                                                                key={choice_id}
                                                                className="w-full sm:w-1/2 lg:w-1/4 p-2"
                                                            >
                                                                <BarChart
                                                                    width={200}
                                                                    height={200}
                                                                    data={chartData}
                                                                    margin={{
                                                                        top: 20,
                                                                        right: 30,
                                                                        left: 20,
                                                                        bottom: 5,
                                                                    }}
                                                                >
                                                                    <CartesianGrid strokeDasharray="3 3"/>
                                                                    <XAxis dataKey="answer" tick={false}/>
                                                                    <YAxis/>
                                                                    <Tooltip/>
                                                                    <Legend/>
                                                                    <Bar dataKey="count" fill="#8884d8"/>
                                                                </BarChart>
                                                                <h3 className="text-sm font-semibold">{LABEL}</h3>
                                                            </div>
                                                        );
                                                    }
                                                )}

                                            {subjectiveResponsesMap[item.cohortsId] &&
                                                Object.keys(subjectiveResponsesMap[item.cohortsId][lectureName]).map(
                                                    (choice_id) => {
                                                        const {
                                                            LABEL,
                                                            responses,
                                                        } = subjectiveResponsesMap[item.cohortsId][lectureName][choice_id];

                                                        // 필터링된 응답
                                                        const filteredResponses = (responses || []).filter(
                                                            response => typeof response === 'string' && response.trim() !== ""
                                                        );

                                                        return (
                                                            <div key={choice_id} className="w-full p-2">
                                                                <h3 className="text-sm font-semibold">
                                                                    {LABEL}
                                                                </h3>
                                                                {filteredResponses.length > 0 ? (
                                                                    <ul className="list-disc list-inside">
                                                                        {filteredResponses.map((response, index) => (
                                                                            <li key={index}>{response}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-gray-500">등록된 답변이 없습니다.</p>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </Modal>
            <div className="flex justify-center">
                <p className="text-3xl">과정별 강의평가 집계</p>
            </div>
            <p className="border mt-6 mb-8 mr-2 ml-2"></p>

            <div className="px-3 py-4">
                {cohorts.map((item) => (
                    <div
                        key={item.cohortsId}
                        className="bg-white hover:bg-gray-50 mb-6 flex flex-col p-5 delay-100 duration-300 rounded-lg cursor-pointer border border-dashed shadow-md transition-transform transform hover:scale-105"
                        onClick={() => goOpen(item.cohortsId)}
                    >
                        <span>{item.cohortsName}</span>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default EvaluationManagement;
