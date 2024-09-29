import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@windmill/react-ui";
import EditInfo from "./EditInfo";

const Mypage = ({testId}) => {
    const router = useHistory();
    const [userId, setUserId] = useState(testId);
    const [info, setInfo] = useState({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [career, setCareer] = useState("");
    const [stack, setStack] = useState("");
    const [record, setRecord] = useState("");
    const [teacherInfo, setTeacherInfo] = useState({});
    const [addCareerLimits, setAddCareerLimits] = useState(false);
    const fileInputRef = useRef(null);
    const [imgPath, setImgPath] = useState(null);
    const [reload, setReload] = useState(false);
    const history = useHistory();
    const [infoEdit, setInfoEdit] = useState(false)

    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setUserId(cookie.userId || 'No cookie found');
    }, []);

    useEffect(() => {
        if (userId) {
            fetchInfo();
            getTeacherInfo(userId);
        }
    }, [userId]);

    const fetchInfo = async () => {
        try {
            const response = await axios.get(`/info/${userId}`);
            const addressParts = response.data[0].address ? response.data[0].address.split(",") : ["", ""];
            setInfo({...response.data[0], address: addressParts[0], address2: addressParts[1]});
            // console.log(response)
        } catch (error) {
            console.error('Error fetching Info:', error);
        }
    };

    //로그인한 강사 경력 가져오기
    const getTeacherInfo = async () => {
        const res = await axios.get(`/selectTeacher`, {
            params: {userId} // 쿼리 파라미터를 명확하게 전달
        });
        setCareer(res.data.career)
        setRecord(res.data.record)
        setStack(res.data.stack)
        setTeacherInfo(res.data)
        setAddCareerLimits(!!res.data)
    }

    //강사 경력 추가
    const insertTeacherInfo = async () => {
        const res = await axios.post("/insertTeacherInfo", {
            userId: userId,
            career: career,
            stack: stack,
            record: record
        });
        console.log(res);
        if (res.data === "success") {
            setTeacherInfo({
                ...teacherInfo,
                career: career,
                stack: stack,
                record: record
            });
            closeModal();
            alert("등록 완료");
        } else {
            alert("등록 실패");
        }
        setAddCareerLimits(true);
    }

    //강사 경력 수정

    const updateTeacherInfo = async () => {
        const res = await axios.post("/teacherUpdate", {
            userId: userId,
            career: career,
            stack: stack,
            record: record
        });
        // console.log(res);
        if (res.data === "success") {
            setTeacherInfo({
                ...teacherInfo,
                career: career,
                stack: stack,
                record: record
            });
            closeModal();
            alert("수정 완료");
            getTeacherInfo(userId)
        } else {
            alert("수정 실패");
        }
    }

    //엔터키
    const addEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            insertTeacherInfo();
        }
    }

    //모달
    const openAddModal = () => {
        if (addCareerLimits) {
            alert("이미 추가 하셨습니다.");
        } else {
            setAddModalOpen(true);
        }
    };
    const openEditModal = () => {
        setEditModalOpen(true);
    };

    const open = () =>{
        setInfoEdit(true)
    }

    const close = () =>{
        setInfoEdit(false)
        fetchInfo();
    }
    const editEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateTeacherInfo();
        }
    }

    const closeModal = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
    };

    const changeImg = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();

        formData.append('file', file);
        formData.append("userId", userId);

        try {
            const res = await axios.post('/updateProfileImg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data !== "fail") {
                alert('이미지 업로드 성공');
                // window.location.reload();
                history.replace();
            } else {
                alert('이미지 업로드 실패');
            }
        } catch (error) {
            console.error('이미지 업로드 중 오류 발생:', error);
            alert('이미지 업로드 중 오류 발생');
        }
    };

    const getImage = async () => {
        const res = await axios.post("/getProfileImage", {userId});
        setImgPath(res.data);
    }

    useEffect(() => {
        const getImage = async () => {
            const res = await axios.post("/getProfileImage", {userId});
            setImgPath(res.data);
        }

        if (userId !== null) {
            getImage();
        }
    }, [userId]);

    return (
        <div className="flex flex-col flex-wrap bg-white rounded-lg shadow-md p-6 mt-8 mb-6"
             style={{fontFamily: "Pretendard-Regular"}}>
            <div className="flex justify-center mt-3">
                <p className="text-3xl">마이페이지</p>
            </div>
            <p className="border mt-6"></p>
            <div className="p-6 w-full items-center" style={{maxHeight: "48rem"}}>
                <div className="text-center relative border-b-2 pb-10 pt-3">
                    <img
                        src={imgPath || "/profile-icon.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto shadow-xl"
                    />
                    {/*<input*/}
                    {/*    type="file"*/}
                    {/*    ref={fileInputRef}*/}
                    {/*    onChange={handleFileChange}*/}
                    {/*    style={{display: 'none'}}  // 파일 선택 창을 숨깁니다.*/}
                    {/*/>*/}
                    <h2 className="mt-4 text-xl">{info.name}</h2>
                    {/*<div className="flex justify-center mt-4">*/}
                    {/*    <button*/}
                    {/*        onClick={changeImg}*/}
                    {/*        className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-black bg-yellow-100 border border-transparent active:bg-yellow-300 hover:bg-yellow-200 focus:shadow-outline-yellow mx-2">사진*/}
                    {/*        변경*/}
                    {/*    </button>*/}
                    {/*    <button*/}
                    {/*        className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-black bg-gray-200 border border-transparent active:bg-gray-400 hover:bg-gray-300 focus:shadow-outline-gray mx-2">사진*/}
                    {/*        삭제*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>
                {
                    info.authorityId === 'A003' ?
                        <div className="flex flex-col md:flex-row items-center justify-center">
                            <div className="mt-8 mb-8 mx-24 mr-10 flex flex-col">
                                <div className="mb-6 flex">
                                    <span>✉️</span>
                                    <span className="ml-2">{info?.email || ''}</span>
                                </div>
                                <p className="mb-6 flex">
                                    <span>📞</span>
                                    <span className="ml-2">{info?.phone || ''}</span>
                                </p>
                                <p className="mb-6 flex">
                                    <span>🏠</span>
                                    <span className="ml-2">{info?.address || ''}, {info?.address2 || ''}</span>
                                </p>
                                <p className="mb-6 flex">
                                    <span>💻</span>
                                    <span
                                        className="ml-2">{info.authorityId === 'A003' ? info.cohortsName : "넥스트IT 교육센터"}</span>
                                </p>
                            </div>
                        </div> : <div className="flex flex-col md:flex-row justify-around">
                            <div className="mt-16 mb-12 mx-24 mr-10 flex flex-col">
                                <p className="mb-6 flex">
                                    <span>✉️</span>
                                    <span className="ml-2">{info?.email || ''}</span>
                                </p>
                                <p className="mb-6 flex">
                                    <span>📞</span>
                                    <span className="ml-2">{info?.phone || ''}</span>
                                </p>
                                <p className="mb-6 flex">
                                    <span>🏠</span>
                                    <span className="ml-2">{info?.address || ''}, {info?.address2 || ''}</span>
                                </p>
                                <p className="mb-6 flex">
                                    <span>💻</span>
                                    <span
                                        className="ml-2">{info.authorityId === 'A003' ? info.cohortsName : "넥스트IT 교육센터"}</span>
                                </p>
                            </div>
                            {/* 강사, 관리자일 때 강사 정보 보이게 */}
                            {(info.authorityId === 'A002' || info.authorityId === 'A001') && (
                                <div className="border-l flex flex-col md:flex-row md:ml-10">
                                    <div className="pl-10 items-center mb-12 ml-10 mr-20" style={{marginTop: '3.3rem'}}>
                                        <div className="flex flex-row">
                                            <div className="justify-center items-center flex text-lg mr-1 mt-2">📍</div>
                                            <div className="mb-4 flex flex-col mt-2">
                                                <span style={{fontSize: '0.75rem'}}>&nbsp;경력</span>
                                                <span className="mt-1">{teacherInfo.career}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-row">
                                            <div className="justify-center items-center flex text-lg mr-1 mt-2">🗃️</div>
                                            <div className="mb-4 flex flex-col mt-2">
                                                <span style={{fontSize: '0.75rem'}}>&nbsp;스택</span>
                                                <span className="mt-1">{teacherInfo.stack}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-row">
                                            <div className="justify-center items-center flex text-lg mr-1 mt-2">📋</div>
                                            <div className="mb-4 flex flex-col mt-2">
                                                <span style={{fontSize: '0.75rem'}}>&nbsp;이력</span>
                                                <span className="mt-1">{teacherInfo.record}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                }

                {/* 경력 추가 및 수정 버튼 */}
                <div className="flex justify-end">
                    <div>
                        {(info.authorityId === 'A002' || info.authorityId === 'A001') && !addCareerLimits && (
                            <div className="flex justify-end">
                                <button
                                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-black bg-purple-300 border border-transparent active:bg-purple-500 hover:bg-purple-400 focus:shadow-outline-purple mx-2"
                                    onClick={openAddModal}
                                >
                                    경력 추가
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        {/* 강사 경력 수정 */}
                        {(info.authorityId === 'A002' || info.authorityId === 'A001') && (
                            <div className="flex justify-end">
                                <button
                                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-black bg-blue-300 border border-transparent active:bg-blue-500 hover:bg-blue-400 focus:shadow-outline-blue mx-2"
                                    onClick={openEditModal}
                                >
                                    경력 수정
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={addModalOpen} onClose={closeModal}>
                    <div className="p-2 border rounded-md">
                        <p className="text-3xl">강사 정보 추가</p>
                        <ModalHeader>경력</ModalHeader>
                        <input
                            type="text"
                            name="career"
                            placeholder="내용을 입력하세요."
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}
                            value={career}
                            onChange={(e) => setCareer(e.target.value)}
                            onKeyDown={addEnterKey}
                        />
                        <ModalHeader>스택</ModalHeader>
                        <input
                            type="text"
                            name="stack"
                            placeholder="내용을 입력하세요."
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}
                            value={stack}
                            onChange={(e) => setStack(e.target.value)}
                            onKeyDown={addEnterKey}
                        />
                        <ModalHeader>이력</ModalHeader>
                        <input
                            type="text"
                            name="record"
                            placeholder="내용을 입력하세요."
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}
                            value={record}
                            onChange={(e) => setRecord(e.target.value)}
                            onKeyDown={addEnterKey}
                        />
                    </div>
                    <ModalFooter>
                        <div className="block w-full">
                            <Button block size="large" onClick={insertTeacherInfo}>
                                추가
                            </Button>
                        </div>
                        <div className="block w-full">
                            <Button block size="large" layout="outline" onClick={closeModal}>
                                취소
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>

                {/*경력추가 모달*/}
                <Modal isOpen={editModalOpen} onClose={closeModal}
                       style={{fontFamily: "Pretendard-Regular"}}>
                    <div className="p-2 border rounded-md mb-8 mt-2 p-5">
                        <p className="text-3xl">강사 정보 수정</p>
                        <ModalHeader>경력</ModalHeader>

                        <input
                            type="text"
                            name="content"
                            placeholder="내용을 입력하세요."
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}
                            value={career || ''}
                            onChange={(e) => setCareer(e.target.value)}
                            onKeyDown={editEnterKey}
                        />
                        <ModalHeader>스택</ModalHeader>
                        <input
                            type="text"
                            name="content"
                            placeholder="내용을 입력하세요."
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}
                            value={stack || ''}
                            onChange={(e) => setStack(e.target.value)}
                            onKeyDown={editEnterKey}
                        />
                        <ModalHeader>이력</ModalHeader>
                        <input
                            type="text"
                            name="content"
                            placeholder="내용을 입력하세요."
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}
                            value={record || ''}
                            onChange={(e) => setRecord(e.target.value)}
                            onKeyDown={editEnterKey}
                        />
                    </div>
                    <ModalFooter>
                        <div className="block w-full">
                            <button
                                className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-3 rounded-lg text-white bg-blue-300 border border-transparent active:bg-blue-500 hover:bg-blue-400 focus:shadow-outline-purple w-full"
                                onClick={updateTeacherInfo}>
                                수정
                            </button>
                        </div>
                        <div className="block w-full">
                            <Button block size="large" layout="outline" onClick={closeModal}>
                                취소
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>

                {/* 유저 정보 수정 */}
                <div className="mt-6 border-t-2">
                    <div className="mt-4 flex justify-end mr-1">
                        <button type="submit"
                                className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-black bg-pink-200 border border-transparent active:bg-pink-400 hover:bg-pink-300 focus:shadow-outline-purple w-1/6 mt-1"
                                onClick={open}>
                            수정
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={infoEdit} onClose={close}>
                <EditInfo userId={userId} close={close}/>
            </Modal>
        </div>

    );
};

export default Mypage;