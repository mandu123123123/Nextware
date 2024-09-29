import React, {useEffect, useState} from "react";
import {
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableContainer,
    Button,
    Modal,
    ModalHeader,
    ModalFooter,
} from "@windmill/react-ui";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";
import AttendanceReq from "./AttendanceReq";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import attendanceReq from "./AttendanceReq";
import {DropdownIcon} from "../icons";

function Attendance() {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [authId, setAuthId] = useState("");
    const [commuteList, setCommuteList] = useState([]);
    const [courseInfo, setCourseInfo] = useState([]);
    const [today, setToday] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(7);
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / perPage);
    const [attendInfo, setAttendInfo] = useState({current: 0, total: 1});
    const [total, setTotal] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setUserId(cookie.userId || 'No cookie found');
        setAuthId(cookie.authorityId);
        setName(cookie.name);

        const now = new Date();
        const formatNow = moment(now).format("YYYY.MM.DD");
        setToday(formatNow);
    }, []);

    useEffect(() => {
        if (userId) {
            selectList();
            countStatus();
        }
    }, [userId, currentPage]);

    const selectList = async () => {
        const res = await axios.post("/commute/selects", {
            userId: userId,
            currentPage: currentPage,
            perPage: perPage,
        });
        console.log(">>", res.data.commutes)
        setCommuteList(res.data.commutes);
        setTotalCount(res.data.totalCount);
    };

    //출석 현황
    const countStatus = async () => {
        try {
            const res = await axios.get(`/countStatus?userId=${userId}`)
            console.log(",", res.data)
            setTotal(res.data)
        } catch (error) {
            console.error("Error", error)
        }
    }

    useEffect(() => {
        if (total) {
            selectCourse(total.attendance);
        }
    }, [total])


    const selectCourse = async (attendance) => {
        const res = await axios.get(`/countDate?userId=${userId}`);
        console.log(res.data)
        setCourseInfo(res.data);

        const totalDay = res.data.weekday_count
        const progress = Math.min(100, Math.max(0, Math.round(((attendance / totalDay) * 100) * 100) / 100));

        setAttendInfo({current: progress, total: totalDay});
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
    };
    // Progress Bar 스타일 설정
    const progressBarStyle = {
        width: `${attendInfo.current}%`,
        background: 'linear-gradient(45deg,#f9a8d4,#93c5fd)',
        height: "100%",
        borderRadius: "5px",
        transition: "width 0.3s ease-in-out",
    };

    const containerStyle = {
        width: "100%",
        backgroundColor: "#f3f3f3",
        borderRadius: "5px",
        overflow: "hidden",
        height: "25px",
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [openPdf, setOpenPdf] = useState(false)
    const closePdf = () => {
        setOpenPdf(false)
    }
    const downloadPDF = async () => {
        if(startDate && endDate) {
            setOpenPdf(true)
            closeModal();
        }
        else{
            alert("날짜를 전부 입력하세요")
        }
    };

    return (
        <>
            <div className="w-full pt-6 px-6 bg-white rounded-lg shadow-md mx-auto max-w-full mt-6"
                 style={{fontFamily: "Pretendard-Regular", height: '50rem'}}>
                {/* 제목 및 정보 표시 */}
                <div className="flex justify-center border-b-2 pb-3 mb-6">
                    <p className="text-3xl">{"<"}{name}>님의 출석 현황</p>
                    <p className="text-sm pt-3"><span>&nbsp;&nbsp;</span>[{today} 기준]</p>
                </div>
                {/* 출석 Progress Bar */}
                {authId === "A003" && (
                    <>
                        {userId && (
                            <div className="flex justify-center">
                                {courseInfo?.cohort_names} ({courseInfo?.start_date} ~{" "}
                                {courseInfo?.end_date})
                            </div>
                        )}
                        <div style={containerStyle} className="mt-2 mb-5">
                            <div style={progressBarStyle} className="text-black text-center">
                                {attendInfo.current}% ({total.attendance}/{attendInfo.total}일)
                            </div>
                        </div>
                    </>
                )}
                {/* 출석 정보 테이블 */}
                <TableContainer>
                    <Table>
                        <TableHeader className="bg-purple-100">
                            <TableCell>출석</TableCell>
                            <TableCell>결석</TableCell>
                            <TableCell>지각</TableCell>
                            <TableCell>조퇴</TableCell>
                            <TableCell>총결석일</TableCell>
                            <TableCell>총수업일</TableCell>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{total.attendance}</TableCell>
                                <TableCell>{total.absence}</TableCell>
                                <TableCell>{total.late}</TableCell>
                                <TableCell>{total.leaveEarly}</TableCell>
                                <TableCell>{total.totalAbsence}</TableCell>
                                <TableCell>{courseInfo.weekday_count}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="flex justify-between mt-1 text-center">
                    <div className="text-right text-gray-500 pt-1 pl-3">※ 지각 · 조퇴 3회는 결석 1회로 산정</div>
                    <div className="flex justify-center mt-1">
                        <button
                            className="text-sm bg-blue-400 hover:bg-blue-500 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={openModal}>
                            출석부 다운
                        </button>
                    </div>
                </div>

                {/* 출석 내역 테이블 */}
                <TableContainer className="mt-8">
                    <Table>
                        <TableHeader className="bg-purple-100">
                            <TableCell>일자</TableCell>
                            <TableCell>입실 시간</TableCell>
                            <TableCell>퇴실 시간</TableCell>
                            <TableCell>출결 상태</TableCell>
                        </TableHeader>
                        <TableBody>
                            {commuteList.map((v, i) => {
                                const datePart = v.date ? v.date : "-";
                                const dateInTime = v.arriveTime ? v.arriveTime.split("T")[1] : "-";
                                const dateOutTime = v.leaveTime ? v.leaveTime.split("T")[1] : "-";
                                const status = v.status;
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{datePart}</TableCell>
                                        <TableCell>{dateInTime}</TableCell>
                                        <TableCell>{dateOutTime}</TableCell>
                                        <TableCell>{status}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 페이지 네비게이션 */}
                <div className="p-4 flex items-center flex-wrap justify-center">
                    <nav aria-label="Page navigation">
                        <ul className="inline-flex">
                            <li>
                                <button onClick={() => {
                                    setCurrentPage(currentPage - 1)
                                }}
                                        disabled={currentPage === 1}
                                        className="h-10 px-5 text-gray-600 transition-colors duration-150 rounded-l-lg focus:shadow-outline active:bg-purple-200 hover:bg-purple-100">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd" fillRule="evenodd"></path>
                                    </svg>
                                </button>
                            </li>
                            {(() => {
                                const maxVisiblePages = 5;
                                let pagesToShow = [];

                                if (totalPages <= maxVisiblePages) {
                                    pagesToShow = Array.from({length: totalPages}, (_, i) => i + 1);
                                } else if (currentPage <= 2) {
                                    pagesToShow = Array.from({length: maxVisiblePages}, (_, i) => i + 1);
                                } else if (currentPage > totalPages - 2) {
                                    const startPage = totalPages - maxVisiblePages + 1;
                                    pagesToShow = Array.from({length: maxVisiblePages}, (_, i) => startPage + i);
                                } else {
                                    const startPage = currentPage - 1;
                                    pagesToShow = Array.from({length: maxVisiblePages}, (_, i) => startPage + i).filter((page) => page >= 1 && page <= totalPages);
                                }

                                return pagesToShow.map((page) => (
                                    <li key={page}>
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-10 px-5 transition-colors duration-150 focus:shadow-outline ${
                                                currentPage === page
                                                    ? "bg-purple-500 text-white border border-transparent"
                                                    : "text-gray-600 hover:bg-purple-100"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ));
                            })()}
                            <li>
                                <button onClick={() => {
                                    setCurrentPage(currentPage + 1)
                                }}
                                        disabled={currentPage === totalPages}
                                        className="h-10 px-5 text-gray-600 transition-colors duration-150 rounded-r-lg focus:shadow-outline active:bg-purple-200 hover:bg-purple-100">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd" fillRule="evenodd"></path>
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300 border-b-2 pb-2">출석부 신청</p>
                <ModalHeader>날짜 선택하기</ModalHeader>
                <div className="flex border-b-2 mt-2 pb-4 mb-4">
                    <div className="w-full">
                        <p>시작일</p>
                        <input type="date" name="startDate" className="rounded-lg mr-2"
                               style={{backgroundColor: "#f9fafb"}} value={startDate} onChange={handleStartDateChange}/>
                    </div>
                    <div className="w-full">
                        <p>종료일</p>
                        <input type="date" name="endDate" className="rounded-lg" style={{backgroundColor: "#f9fafb"}}
                               value={endDate} onChange={handleEndDateChange}/>
                    </div>
                </div>
                <ModalFooter>
                    <div className="block w-full">
                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-3 rounded-lg text-white bg-blue-400 border border-transparent hover:bg-blue-500 focus:shadow-outline-purple w-full" block size="large" onClick={downloadPDF}>
                            신청
                        </button>
                    </div>
                    <div className="block w-full">
                        <Button block size="large" layout="outline" onClick={closeModal}>
                            취소
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
            {
                openPdf ?
                    <AttendanceReq className="z-0" userId={userId} startDate={startDate} endDate={endDate} name={name}
                                   courseInfo={courseInfo} close={closePdf}/> : null
            }
        </>
    );
}

export default Attendance;