import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "@windmill/react-ui";

function LectureManagement() {
    const [lectures, setLectures] = useState([]);
    const [coLectList, setCoLectList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openAddLec, setOpenAddLect] = useState(false);
    const [selectedCohortsId, setSelectedCohortsId] = useState(null);
    const [lectureAdded, setLectureAdded] = useState(false);
    const [filteredLectures, setFilteredLectures] = useState([]);
    const [lectureState, setLectureState] = useState(true);
    const [addlectureState, setAddLectureState] = useState(true);
    const [createLecture, setCreateLecture] = useState({ lecName: '', teacherId: '' });

    // 과목 리스트
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("/getLectureList");
            setLectures(res.data);
        };
        fetchData();
    }, [lectureState]);

    // 기수별 과목리스트
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("/getCohortLectures");

            const groupedData = res.data.reduce((acc, current) => {
                const { cohortsId, cohortsName, lectureName, teacherName, lectureNo } = current;

                if (!acc[cohortsId]) {
                    acc[cohortsId] = {
                        cohortsId,
                        cohortsName,
                        lectures: []
                    };
                }

                acc[cohortsId].lectures.push({ lectureName, teacherName, lectureNo });

                return acc;
            }, {});

            const result = Object.values(groupedData);
            setCoLectList(result);
        };

        fetchData();
    }, [lectureAdded]);

    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("/getTeachers");
            setTeachers(res.data);
        };

        fetchData();
    }, []);

    const addLecture = (cohortsId) => {
        setSelectedCohortsId(cohortsId);
        // 현재 기수에 추가되지 않은 과목만 필터링
        const currentCohort = coLectList.find((cohort) => cohort.cohortsId === cohortsId);
        const addedLectureNos = currentCohort ? currentCohort.lectures.map((lecture) => lecture.lectureNo) : [];
        const filteredLectures = lectures.filter((lecture) => !addedLectureNos.includes(lecture.lectureNo));
        setFilteredLectures(filteredLectures);
        setIsOpen(true);
    };

    const newLecture = () => {
        setOpenAddLect(true);
    };

    const delLecture = async (lectureNo) => {
        // eslint-disable-next-line no-restricted-globals
        const isDel = confirm("해당 과목을 삭제 하시겠습니까?");
        if (isDel) {
            const res = await axios.post("/delLecture", { lectureNo });
            setLectureState(!lectureState);
        }
    };

    const addNewLecture = async () => {
        const res = await axios.post("/addNewLectures", { createLecture });
        if (res.data === "success") {
            setOpenAddLect(false);
            setLectureState(!lectureState);
        }
    };

    const addLectureToCohort = async (item) => {
        item.cohortsId = selectedCohortsId;
        const res = await axios.post("/addNewLectureToCohort", { item });
        if (res.data === "success") {
            setLectureAdded((prevState) => !prevState);

            // 추가된 과목을 필터링된 리스트에서 제거
            const updatedFilteredLectures = filteredLectures.filter((lecture) => lecture.lectureNo !== item.lectureNo);
            setFilteredLectures(updatedFilteredLectures);
        }
    };

    const delLectureToCohort = async (cohortsId, lectureNo) => {
        // eslint-disable-next-line no-restricted-globals
        const isDel = confirm("선택한 과목을 삭제 하시겠습니까?");
        if (isDel) {
            const res = await axios.post("/delLectureToCohort", { cohortsId, lectureNo });
            if (res.data === "success") {
                setLectureAdded((prevState) => !prevState);
            }
        }
    };

    return (
        <div className="text-gray-900 bg-white h-auto p-6 rounded-lg shadow-md mt-6 mb-6" style={{fontFamily: "Pretendard-Regular"}}>
            {/* 신규 과목 추가하는 Modal */}
            <Modal isOpen={openAddLec} onClose={() => setOpenAddLect(false)} style={{
                content: {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px',
                    height: 'auto',
                    margin: '0',
                    padding: '0',
                }
            }}>
                <div className="flex flex-col p-4" style={{fontFamily: "Pretendard-Regular"}}>
                    <label className="flex flex-row">
                        <p>과목명 :</p>
                        <input type="text" className="rounded-lg bg-gray-100 border-none mb-4 p-4 w-5/6"
                               value={createLecture.lecName}
                               onChange={(e) => {
                                   e.persist();
                                   setCreateLecture(prevState => ({
                                       ...prevState,
                                       lecName: e.target.value
                                   }));
                               }}/>
                    </label>
                    <label>
                        담당 강사:
                        <select className="rounded-lg bg-gray-100 border-none mb-4 p-2 w-64"
                                value={createLecture.teacherId}
                                onChange={(e) => {
                                    e.persist();
                                    setCreateLecture(prevState => ({
                                        ...prevState,
                                        teacherId: e.target.value
                                    }));
                                }}>
                            <option>선택해주세요</option>
                            {teachers.map((v, i) => {
                                return <option key={i} value={v.teacherId}>{v.teacherName}</option>;
                            })}
                        </select>
                    </label>
                    <button onClick={addNewLecture}
                            className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        신규 과목 추가
                    </button>
                </div>
            </Modal>

            {/* 기수에 과목 추가하는 Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} style={{
                content: {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px',
                    height: 'auto',
                    margin: '0',
                    padding: '0',
                }
            }}>
                <div className="px-3 py-4 flex justify-center" style={{fontFamily: "Pretendard-Regular"}}>
                    <table className="w-full text-md bg-gray-100 shadow-md rounded mb-4">
                        <tbody>
                        <tr className="border-b">
                            {/*<th className="text-left p-3 px-5">과목번호</th>*/}
                            <th className="text-left p-3 px-5">과목명</th>
                            <th className="text-left p-3 px-5">담당강사</th>
                            <th></th>
                        </tr>
                        {filteredLectures.map((item, index) => (
                            <tr className="border-b hover:bg-orange-100 bg-white" key={index}>
                                {/*<td className="p-3 px-5">{item.lectureNo}</td>*/}
                                <td className="p-3 px-5">{item.lectureName}</td>
                                <td className="p-3 px-5">{item.teacherName}</td>
                                <td className="p-3 px-5 flex justify-end">
                                    <button type="button" onClick={() => {
                                        addLectureToCohort(item);
                                    }}
                                            className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">선택
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Modal>

            {/*<div className="p-4 flex w-full text-center">*/}
            {/*    <h1 className="text-3xl w-full">*/}
            {/*        과목 리스트*/}
            {/*    </h1>*/}
            {/*</div>*/}
            <div className="flex justify-center">
                <p className="text-3xl">과목 리스트</p>
            </div>
            <p className="border mt-6 mb-8"></p>

            <div className="px-3 py-4 flex justify-center">
                <table className="w-full text-md bg-gray-100 shadow-md rounded mb-4">
                    <tbody>
                    <tr className="border-b">
                        <th className="text-left p-3 px-5">No.</th>
                        {/*<th className="text-left p-3 px-5">과목번호</th>*/}
                        <th className="text-left p-3 px-5">과목명</th>
                        <th className="text-left p-3 px-5">담당강사</th>
                        <th className="text-right p-3 px-5">
                            <button type="button" onClick={newLecture}
                                    className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">추가
                            </button>
                        </th>
                    </tr>
                    {lectures.map((item, index) => (
                        <tr className="border-b hover:bg-gray-50 bg-white" key={index}>
                            <td className="p-3 px-5">{index + 1}</td>
                            {/*<td className="p-3 px-5">{item.lectureNo}</td>*/}
                            <td className="p-3 px-5">{item.lectureName}</td>
                            <td className="p-3 px-5">{item.teacherName}</td>
                            <td className="p-3 px-5 flex justify-end">
                                <button type="button" onClick={() => delLecture(item.lectureNo)}
                                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* 구분선 */}
            {/*<div className="p-4 flex w-full text-center">*/}
            {/*    <h1 className="text-3xl w-full">*/}
            {/*        기수별 과목 리스트*/}
            {/*    </h1>*/}
            {/*</div>*/}
            <div className="flex justify-center mt-12">
                <p className="text-3xl">기수별 과목 리스트</p>
            </div>
            <p className="border mt-6 mb-8"></p>

            <div className="grid grid-cols-2">
                {coLectList.map((item, index) => (
                    <div className="px-3 py-4 flex justify-center" key={index}>
                        <table className="w-full text-md bg-gray-100 shadow-md rounded-lg mb-4">
                            <caption style={{marginBottom: '1rem'}}>{item.cohortsName}</caption>
                            <tbody>
                            <tr className="border-b h-1 ">
                                <th className="text-left p-3 px-5">No</th>
                                {/*<th className="text-left p-3 px-5">과목번호</th>*/}
                                <th className="text-left p-3 px-5">과목명</th>
                                <th className="text-left p-3 px-5">담당강사</th>
                                <th className="text-right p-3 px-5">
                                    <button type="button" onClick={() => addLecture(item.cohortsId)}
                                            className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">추가
                                    </button>
                                </th>
                            </tr>
                            {item.lectures.map((iteml, index) => (
                                <tr className="border-b hover:bg-gray-50 bg-white" key={index}>
                                    <td className="p-3 px-5">{index + 1}</td>
                                    {/*<td className="p-3 px-5">{iteml.lectureNo}</td>*/}
                                    <td className="p-3 px-5">{iteml.lectureName}</td>
                                    <td className="p-3 px-5">{iteml.teacherName}</td>
                                    <td className="p-3 px-5 flex justify-end">
                                        <button type="button" onClick={() => {
                                            delLectureToCohort(item.cohortsId, iteml.lectureNo)
                                        }}
                                                className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default LectureManagement;
