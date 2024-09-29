import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import {
    Badge,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHeader,
    TableRow,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Label,
    Select,
} from "@windmill/react-ui";
import axios from "axios";
import {disabled} from "express/lib/application";

function ApproveLeave() {
    const [leave, setLeave] = useState([]);
    const [filteredLeave, setFilteredLeave] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leaveId, setLeaveId] = useState();
    const [userId, setUserId] = useState();
    const [name, setName] = useState();
    const [leaveType, setLeaveType] = useState();
    const [leaveName, setLeaveName] = useState();
    const [reason, setReason] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [state, setState] = useState("Y");
    const [comment, setComment] = useState();
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    useEffect(() => {
        fetchLeave();
    }, []);

    useEffect(() => {
        filterLeave();
    }, [leave, filter]);

    const fetchLeave = async () => {
        try {
            const res = await axios.get('/viewLeave');
            // console.log(">>",res.data);
            setLeave(res.data);
        } catch (error) {
            console.error("fetch error", error);
        }
    };

    const filterLeave = () => {
        let filtered;
        switch (filter) {
            case "pending":
                filtered = leave.filter(item => !item.approveYn);
                break;
            case "approved":
                filtered = leave.filter(item => item.approveYn === 'Y');
                break;
            case "rejected":
                filtered = leave.filter(item => item.approveYn === 'N');
                break;
            default:
                filtered = leave;
        }
        setFilteredLeave(filtered);
        setCurrentPage(1);  // Reset to first page when filter changes
    };

    const updateApprove = async () => {
        try {
            const res = await axios.post('/updateApprove', { leaveId: leaveId, leaveType: leaveType, userId: userId, state: state, comment: comment });
            alert('결재가 완료되었습니다.');
            closeModal();
            fetchLeave();
        } catch (error) {
            console.error("update error", error);
        }
    };

    const goUpdate = (data) => {
        setIsModalOpen(true);
        setLeaveId(data.leaveId);
        setUserId(data.userId);
        setName(data.name);
        setLeaveType(data.leaveType);
        setLeaveName(data.leaveName);
        setReason(data.reason);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setState(data.state)
    };

    const selectState = useCallback((e) => {
        console.log("???/",e.target.value)
        setState(e.target.value);
    }, []);

    const commentHandler = useCallback((e) => {
        setComment(e.target.value);
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const calculate = (param1, param2) => {
        const timeDiff = new Date(param2) - new Date(param1) + 1;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    const onPageChange = (p) => {
        setCurrentPage(p);
    };

    // Calculate pagination
    const totalResults = filteredLeave.length;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const currentData = filteredLeave.slice(startIndex, endIndex);

    return (
        <div className="w-full py-8 px-4 bg-white rounded-lg shadow-md mx-auto max-w-full mt-6"
             style={{fontFamily: "Pretendard-Regular", height: '50rem'}}>
            {/*<PageTitle>휴가 관리</PageTitle>*/}
            <div className="flex justify-center">
                <p className="text-3xl">승인 대기</p>
            </div>
            <p className="border mt-6 mb-8"></p>

            <div className="mb-4">
                <button type="button"
                        onClick={() => setFilter("all")}
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    전체
                </button>
                <button type="button"
                        onClick={() => setFilter("pending")}
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    미완료
                </button>
                <button type="button"
                        onClick={() => setFilter("approved")}
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    승인
                </button>
                <button type="button"
                        onClick={() => setFilter("rejected")}
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    반려
                </button>
            </div>
            <TableContainer>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>이름</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell  className="text-center">기간</TableCell>
                            <TableCell  className="text-center">항목</TableCell>
                            <TableCell  className="text-center">사용시간</TableCell>
                            <TableCell  className="text-center">상태</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map((v, i) => (
                            <TableRow key={i} className="cursor-pointer hover:font-bold" onClick={() => goUpdate({
                                leaveId: v.leaveId,
                                userId: v.userId,
                                name: v.name,
                                leaveName: v.leaveName,
                                leaveType: v.leaveType,
                                reason: v.reason,
                                startDate: v.startDate,
                                endDate: v.endDate,
                                state: v.approveYn,
                            })}>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        <span className="font-semibold">{v.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{v.userId}</span>
                                </TableCell>
                                <TableCell className="text-center">{v.leaveName === "연차" ?
                                    <span className="text-sm">{v.startDate} ~ {v.endDate}</span> :
                                    <span className="text-sm">{v.startDate}</span>}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="text-sm">{v.leaveName}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="text-sm">{v.leaveName === "연차" ? calculate(v.startDate, v.endDate) : 0.5}일</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    {v.approveYn === 'Y' ? <Badge type="success">승인</Badge> :
                                        v.approveYn === 'N' ? <Badge type="danger">반려</Badge> : ''}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <Pagination
                        totalResults={totalResults}
                        resultsPerPage={resultsPerPage}
                        onChange={onPageChange}
                        label="Table navigation"
                    />
                </TableFooter>
            </TableContainer>

            <Modal isOpen={isModalOpen}  onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                <p className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">{name} 님이 결재를 요청했습니다</p>
                <ModalBody>
                    <div className="mb-4">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th className="text-left">이름</th>
                                <th className="text-left">기간</th>
                                <th className="text-left">종류</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{name}</td>
                                <td>{startDate} ~ {endDate}</td>
                                <td>{leaveName}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 w-full font-semibold">사유</p>
                    <textarea className="px-2 py-1 text-gray-600 mt-4 w-full h-16 resize-none rounded-lg" disabled>{reason}</textarea>
                    <div>
                        <div className="w-1/5">
                            <Label>
                                <Select className="mt-1" defaultValue={state} onChange={selectState} disabled={!state ? false: true}>
                                    <option selected disabled>========</option>
                                    <option value="Y">승인</option>
                                    <option value="N">반려</option>
                                </Select>
                            </Label>
                        </div>
                        {state === 'N' ?
                            <div>
                                <p className="mt-4 font-semibold">반려 사유</p>
                                <textarea className="px-2 py-1 text-gray-600 mt-4 w-full h-16 resize-none rounded-lg"
                                          defaultValue={comment} onChange={commentHandler}></textarea>
                            </div> : ''}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-purple-400 border border-transparent hover:bg-purple-500 focus:shadow-outline-purple w-full sm:w-auto" onClick={updateApprove}>확인</button>
                    <button style={{marginLeft: '0.5rem'}} className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-300 border dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:shadow-outline-gray w-full sm:w-auto" layout="outline" onClick={closeModal}>
                        취소
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ApproveLeave;