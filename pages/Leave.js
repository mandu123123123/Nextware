import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableContainer,
} from "@windmill/react-ui";
import {aliasToReal} from "lodash/fp/_mapping";

function Leave() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [cookie, setCookie] = useState("");
    const [leaveDay, setLeaveDay] = useState([]); //남은 휴가
    const [leaveType, setLeaveType] = useState("L001");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [leaveDaysCount, setLeaveDaysCount] = useState(0); // 계산된 휴가 일수
    const [leaveReason, setLeaveReason] = useState("");
    const [name, setName] = useState("")
    const [leaveList, setLeaveList] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / perPage);

    useEffect(() => {
        const cookieValue = Cookies.get("userinfo");
        const userInfo = JSON.parse(cookieValue);
        setName(userInfo.name);
        setCookie(userInfo.userId);
        selectLeave(userInfo.userId || null);
    }, []);


    const selectLeave = async (param) => {
        const res = await axios.get(`/leaveSelects?userId=${param}`);
        setLeaveDay(res.data);
    };

    const addLeave = async () => {
        console.log(leaveDay) //남은 휴가
        console.log(leaveDaysCount) //신청휴가
        if(leaveDay < leaveDaysCount){
            alert("남은 휴가 보다 신청한 휴가가 더 많아 신청이 불가합니다")
        }
        else if(leaveDay >= leaveDaysCount) {
            const res = await axios.post("/leaveInsert", {
                userId: cookie,
                leaveType: leaveType,
                startDate: startDate,
                endDate: endDate,
                reason: leaveReason
            });
            alert("신청이 완료되었습니다")
            closeModal()
            init()
        }
    }

    const selectLeaveApplication = async (param) => {
        const res = await axios.post("/select/application",{userId: param, currentPage: currentPage, perPage: perPage});
        setLeaveList(res.data.leaveList);
        setTotalCount(res.data.totalCountLeaves);
    }

    useEffect(() => {
        if (isListModalOpen) {
            selectLeaveApplication(cookie);
        }
    }, [currentPage]);

    const leaveTypeChange = useCallback((e) => {
        setLeaveType(e.target.value);
    },[]);

    const openModal = () => {
        if(leaveDay <= 0){
          alert("남은 휴가가 없습니다.")
        }else{
            setIsModalOpen(true);
        }
    };

    const openListModal = () => {
        setIsListModalOpen(true);
        selectLeaveApplication(cookie)
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsListModalOpen(false);
        setCurrentPage(1)
        init()
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        if (leaveType === 'L002') {
            setEndDate(newStartDate); // 반차일 경우 startDate와 동일하게 설정
            setLeaveDaysCount(0.5)
        } else {
            calculateLeaveDays(newStartDate, endDate);
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        if (leaveType === 'L001') { // 연차일 경우에만 endDate를 업데이트
            setEndDate(newEndDate);
            calculateLeaveDays(startDate, newEndDate);
        }
    };

    const calculateLeaveDays = (start, end) => {
        const today = new Date(); // 현재 날짜를 가져옴

        if (start && end) {
            // 시작일과 종료일을 배열로 분리
            const startArray = start.split('-');
            const endArray = end.split('-');

            // 배열을 사용해 Date 객체 생성
            const startDate = new Date(startArray[0], startArray[1] - 1, startArray[2]); // 월은 0부터 시작하므로 -1
            const endDate = new Date(endArray[0], endArray[1] - 1, endArray[2]); // 월은 0부터 시작하므로 -1

            // 오늘 날짜와 비교
            if (today > startDate) {
                console.log(startDate)
                alert("오늘 날짜보다 전입니다."); //여기탐
                return; // 알림 후 함수 종료
            }

            // 시작일이 종료일보다 늦은 경우
            if (startDate > endDate) {
                alert("휴가 종료일이 휴가 시작일보다 빠릅니다.");
                setLeaveDaysCount(0); // 일수를 0으로 설정
                return; // 알림 후 함수 종료
            }

            // 날짜 차이 계산
            const timeDiff = endDate - startDate + 1;

            // 날짜 차이가 0 이상인 경우 계산
            if (timeDiff >= 0) {
                const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 일수 계산
                setLeaveDaysCount(dayDiff); // 계산된 일수 상태에 반영
            } else {
                setLeaveDaysCount(0); // 만약 종료일이 시작일보다 이전이면 일수를 0으로 설정
            }
        }
    };

    // 입력란 초기화
    const init = () => {
        setStartDate("")
        setEndDate("")
        setLeaveReason("")
    }

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex justify-between">
                    <div className="p-2">남은 휴가: {leaveDay}일</div>
                    <div className="flex">
                        <div className="pr-2">
                            <button
                                className="bg-blue-100 p-2 rounded-md border items-center justify-center"
                                onClick={openModal}
                            >
                                <div>휴가 신청</div>
                            </button>
                        </div>
                        <div>
                            <button
                                className="bg-pink-100 p-2 rounded-md border items-center justify-center"
                                onClick={openListModal}
                            >
                                <div>신청 현황</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {leaveDay ? (
                <Modal isOpen={isModalOpen} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                    <div className="flex items-center">
                        <div className="text-lg font-bold mr-2">신청자</div>
                        <div className="text-lg">{name}</div>
                    </div>
                    <div className="text-xs ml-1">남은 휴가: {leaveDay}일</div>
                    <div className="border-b-2 mt-2"></div>

                    <ModalHeader>휴가 종류 선택하기</ModalHeader>
                    <div className="flex">
                        <div className="w-2/5">
                            <select
                                name="leaveType"
                                className="w-full rounded-lg mr-2 cursor-pointer"
                                style={{ backgroundColor: "#f9fafb" }}
                                value={leaveType}
                                onChange={leaveTypeChange}
                            >
                                <option value="L001" className="cursor-pointer">연차</option>
                                <option value="L002" className="cursor-pointer">반차</option>
                            </select>
                        </div>
                    </div>
                    <div className="border-b-2 mt-2"></div>
                    <ModalHeader>날짜 선택하기</ModalHeader>
                    <div className="flex">
                        <div className="w-full">
                            <p>휴가 시작일</p>
                            <input
                                type="date"
                                name="startDate"
                                className="rounded-lg mr-2 cursor-pointer"
                                style={{ backgroundColor: "#f9fafb" }}
                                value={startDate}
                                onChange={handleStartDateChange}
                            /><br/>
                        </div>
                        <div className="w-full">
                            {leaveType === 'L001' && (
                                <>
                                <p>휴가 종료일</p>
                                <input
                                    type="date"
                                    name="endDate"
                                    className="rounded-lg cursor-pointer"
                                    style={{ backgroundColor: "#f9fafb" }}
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                />
                                </>
                            )}
                            {leaveType === 'L002' && (
                                <>
                                <p>시간대 선택</p>
                                <div className="w-2/5">
                                    <select
                                        className="w-full rounded-lg mr-2"
                                        style={{backgroundColor: "#f9fafb"}}
                                    >
                                        <option value="AM">오전</option>
                                        <option value="PM">오후</option>
                                    </select>
                                </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-1">일수: {leaveDaysCount}일</div>
                    <div className="border-b-2 mt-2"></div>
                    <ModalHeader>휴가 사유</ModalHeader>
                    <ModalBody>
                        <textarea
                            type="text"
                            name="content"
                            placeholder="내용을 입력하세요."
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb" }}
                            value={leaveReason}
                            onChange={(e)=> setLeaveReason(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <div className="block w-full">
                            <Button block size="large" onClick={addLeave}>
                                신청
                            </Button>
                        </div>
                        <div className="block w-full">
                            <Button block size="large" layout="outline" onClick={closeModal}>
                                취소
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>
            ) : ""}
            <Modal isOpen={isListModalOpen} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                <div style={{height:"440px"}}>
                    <TableContainer className="mt-8">
                        <Table>
                            <TableHeader className="bg-purple-100">
                                <TableCell className="text-center">신청일</TableCell>
                                <TableCell className="text-center">휴가 기간</TableCell>
                                <TableCell className="text-center">일 수</TableCell>
                                <TableCell className="text-center">승인 여부</TableCell>
                            </TableHeader>
                            {leaveList.length > 0 ? <TableBody>
                                {leaveList.map((v, i) => {

                                    return (
                                        <TableRow key={i}>
                                            <TableCell className={v.approveYn == null ? "text-gray-400 text-center" : "text-center"}>{v.applicateDate}</TableCell>
                                            <TableCell className={v.approveYn == null ? "text-gray-400 text-center" : "text-center"}>{v.startDate} ~ {v.endDate}</TableCell>
                                            <TableCell className={v.approveYn == null ? "text-gray-400 text-center" : "text-center"}>
                                                {v.leaveType == 'L001' ? `${((new Date(v.endDate) - new Date(v.startDate)) / (1000 * 60 * 60 * 24)) + 1}일` : "반차"}</TableCell>
                                            <TableCell
                                                className={v.approveYn == 'Y' ? "text-center text-blue-600" : (v.approveYn == 'N' ? "text-center text-red-600" : "text-center text-gray-400")}>{v.approveYn == 'Y' ? "승인" : (v.approveYn == 'N' ? "반려" : "승인 대기")}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody> : ""}
                        </Table>
                    </TableContainer>
                    {leaveList.length == 0 ? <div className="flex justify-center text-center mt-8 text-gray-500">신청 내역이 존재하지 않습니다.</div> : ""}
                </div>
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
                <ModalFooter>
                    <div style={{display: "flex", justifyContent: "end"}} className="sm:block mt-3">
                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-400 border border-transparent active:bg-blue-600 hover:bg-blue-500 focus:shadow-outline-purple ml-3"
                               onClick={closeModal}>닫기</button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Leave;
