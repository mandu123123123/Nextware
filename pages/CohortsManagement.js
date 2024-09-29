import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, ModalHeader } from "@windmill/react-ui"

function CohortsManagement() {
    const [cohorts, setCohorts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [changeReadOnly, setChangeReadOnly] = useState(true);
    const [editCohortsInfo, setEditCohortsInfo] = useState({cohortsId: '', cohortsName: '', startDate: '', endDate: ''});
    const [newCohortsInfo, setNewCohortsInfo] = useState({cohortsName: '', startDate: '', endDate: ''});
    const [reload, setReload] = useState(false);

    // 들어왔을 때 교육과정 정보 가져와서 리스트로 표시
    useEffect(()=>{
        const fetchData = async () => {
            const res = await axios.get("/selectCohorts");
            setCohorts(res.data);
        }

        fetchData();
    },[reload])

    // 모달 열면서 표시할 정보 담기
    const openCohortsInfo = (cohorts => {
        setOpenModal(true)
        setEditCohortsInfo(cohorts)
    })

    // Modal 닫을 때 readonly도 같이 활성화 
    const closeModal = () => {
        setOpenModal(false);
        setChangeReadOnly(true);
    }

    // readonly 바꾸는 핸들러
    const readOnlyHandler = () =>{
        setChangeReadOnly(!changeReadOnly);
    }

    // 수정한 과정정보 담는 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditCohortsInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 수정한 과정 정보 저장하는 부분
    const updateCohortsInfo = async () => {
        const res = await axios.post("/updateCohortsInfo", editCohortsInfo);
        if(res.data === "success"){
            alert("수정되었습니다.");
            closeModal();
            setReload(!reload);
        } else {
            alert("수정 실패. 다시 시도해주세요.")
        }
    }

    // 새로운 과정 추가하는 Modal 여는 부분
    const newCohorts = () => {
        setOpenNewModal(true);
    }

    // 과정 추가 모달 닫는 부분
    const closeNewModal = () => {
        setOpenNewModal(false);
    }

    // 새로운 과정 정보 담는 핸들러
    const newInfohandleChange = (e) => {
        const { name, value } = e.target;
        setNewCohortsInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 새로운 과정 추가하는 부분
    const createNewCohorts = async () => {
        const res = await axios.post("/createCohorts", newCohortsInfo);
        if(res.data === "success"){
            alert("추가되었습니다.");
            setNewCohortsInfo({});
            closeNewModal();
            setReload(!reload);
        } else {
            alert("실패하였습니다. 다시 시도해주세요.")
        }
    }

    // 과정 삭제하는 부분
    const delCohorts = async (cohortsId) => {
        // eslint-disable-next-line no-restricted-globals
        const isdel = confirm("해당 과정을 삭제하시겠습니까?");
        if(isdel){
            const res = await axios.post("/deleteCohorts",{cohortsId});
            if(res.data === "success"){
                alert("삭제되었습니다.");
                closeModal();
                setReload(!reload);
            } else {
                alert("실패하였습니다. 다시 시도해주세요.");
            }
        }
    }

    return (
        <div style={{fontFamily: "Pretendard-Regular", height: '50rem'}}
            className="w-full p-6 bg-white rounded-lg shadow-md mx-auto max-w-full mt-6 flex flex-col gap-4 items-center ">
            {/* 수정하는 Modal */}
            <Modal isOpen={openModal} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                <div>
                    <ModalHeader>과정명</ModalHeader>
                    <input type="text" value={editCohortsInfo.cohortsName} className="w-full rounded-lg"
                           name="cohortsName" onChange={handleChange} readOnly={changeReadOnly}/>
                    <ModalHeader>시작일</ModalHeader>
                    <input type="date" value={editCohortsInfo.startDate} className="w-full rounded-lg" name="startDate"
                           onChange={handleChange} readOnly={changeReadOnly}/>
                    <ModalHeader>수료일</ModalHeader>
                    <input type="date" value={editCohortsInfo.endDate} className="w-full rounded-lg" name="endDate"
                           onChange={handleChange} readOnly={changeReadOnly}/>
                    <div className="mt-4 flex flex-row justify-end">

                        {changeReadOnly ? (
                            <div className="flex flex-row gap-2">
                                <button
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                                    onClick={readOnlyHandler}>
                                    수정
                                </button>
                                <button onClick={()=>{delCohorts(editCohortsInfo.cohortsId)}}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md">
                                    삭제
                                </button>
                            </div>
                        ) : (
                            <button
                                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                                    onClick={updateCohortsInfo}>
                                    저장
                            </button>
                        )}

                    </div>
                </div>
            </Modal>
            {/* 새로 만드는 Modal */}
            <Modal isOpen={openNewModal} onClose={closeNewModal} style={{fontFamily: "Pretendard-Regular"}}>
                <div>
                    <ModalHeader>과정명</ModalHeader>
                    <input type="text" value={newCohortsInfo.cohortsName} className="w-full rounded-lg"
                           name="cohortsName" onChange={newInfohandleChange}/>
                    <ModalHeader>시작일</ModalHeader>
                    <input type="date" value={newCohortsInfo.startDate} className="w-full rounded-lg" name="startDate"
                           onChange={newInfohandleChange}/>
                    <ModalHeader>수료일</ModalHeader>
                    <input type="date" value={newCohortsInfo.endDate} className="w-full rounded-lg" name="endDate"
                           onChange={newInfohandleChange}/>
                    <div className="mt-4 flex flex-row justify-end">

                        <button
                            className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                            onClick={createNewCohorts}>
                            생성
                        </button>

                    </div>
                </div>
            </Modal>
            <button onClick={newCohorts}
                    className="inline-flex items-center px-4 py-2 bg-pink-200 hover:bg-pink-300 text-gray-800 text-sm font-medium rounded-md">
                과정 생성
            </button>
            <span>교육과정 목록</span>
            <span>진행중(예정)인 교육과정</span>

            {
                cohorts.map((cohort, index) => {
                    if (new Date(cohort.endDate) > new Date()) {
                        return (
                            <div className="w-full" key={index}>
                                {/* Card 1 */}
                                <a className="rounded-sm w-full grid grid-cols-12 bg-white shadow p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out transform"
                                   href="#"
                                   onClick={(e) => {
                                       openCohortsInfo(cohort)
                                   }}>
                                    {/* Icon */}
                                    <div className="col-span-12 md:col-span-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                                             viewBox="0 0 24 24" stroke="#3f83f8">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                                        </svg>
                                    </div>
                                    {/* Title */}
                                    <div className="col-span-11 xl:-ml-5">
                                        <p className="text-blue-500 font-semibold"> {cohort.cohortsName} </p>
                                    </div>
                                    {/* Description */}
                                    <div className="md:col-start-2 col-span-11 xl:-ml-5">
                                        <p className="text-sm text-gray-800 font-light"> {cohort.startDate} ~ {cohort.endDate} </p>
                                    </div>
                                </a>
                            </div>
                        )
                    }

                })
            }
            <span className="mt-4">수료한 교육과정</span>
            {
                cohorts.map((cohort, index) => {
                    if (new Date(cohort.endDate) < new Date()) {
                        return (
                            <div className="w-full" key={index}>
                                {/* Card 1 */}
                                <a className="rounded-sm w-full grid grid-cols-12 bg-white shadow p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out transform"
                                   href="#"
                                   onClick={(e) => {
                                       openCohortsInfo(cohort)
                                   }}>
                                    {/* Icon */}
                                    <div className="col-span-12 md:col-span-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                                             viewBox="0 0 24 24" stroke="#2563eb">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                                        </svg>
                                    </div>
                                    {/* Title */}
                                    <div className="col-span-11 xl:-ml-5">
                                        <p className="text-blue-600 font-semibold"> {cohort.cohortsName} </p>
                                    </div>
                                    {/* Description */}
                                    <div className="md:col-start-2 col-span-11 xl:-ml-5">
                                        <p className="text-sm text-gray-800 font-light"> {cohort.startDate} ~ {cohort.endDate} </p>
                                    </div>
                                </a>
                            </div>
                        )
                    }

                })
            }

        </div>
    );
}

export default CohortsManagement;

