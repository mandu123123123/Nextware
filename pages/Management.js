// DataTable.js
import React, { useEffect, useState } from 'react';
import axios from "axios";
import EditMember from "./EditMember";import {
    Modal,
} from "@windmill/react-ui";
const Management = () => {
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showOptions, setShowOptions] = useState({ rowId: null, show: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMember, setEditingMember] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('/management');
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const handleEditClick = (member) => {
        setEditingMember(member);
        setShowOptions({ rowId: null, show: false });
    };

    const handleSaveEdit = async (updatedMember) => {
        try {
            await axios.post(`/management/${updatedMember.userId}`, updatedMember);
            setEditingMember(null);
            fetchMembers();
        } catch (error) {
            console.error('Error updating member:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingMember(null);
    };

    const handleDeleteClick = async (rowId) => {
        const isConfirmed = window.confirm("삭제하시겠습니까?");
        if (isConfirmed) {
            if (rowId === 'admin') {
                alert("관리자 계정은 삭제할 수 없습니다");
                return;
            }
            try {
                await axios.delete(`/management/${rowId}`);
                setMembers(members.filter(member => member.userId !== rowId));
            } catch (error) {
                console.error('멤버 삭제 중 오류 발생:', error);
            }
            setShowOptions({ rowId: null, show: false });
        }
    };

    // 검색 필터 적용
    const filteredMembers = members.filter(member => {
        const searchTermLower = searchTerm.toLowerCase();
        return Object.values(member).some(value =>
            value && value.toString().toLowerCase().includes(searchTermLower)
        );
    });

    // 페이지네이션 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="w-full py-8 px-4 bg-white rounded-lg shadow-md mx-auto max-w-full mt-8"
             style={{ fontFamily: "Pretendard-Regular", height: '46rem' }}>
            <div className="flex justify-center">
                <p className="text-3xl">사용자 관리</p>
            </div>
            <p className="border mt-6 mb-8 "></p>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <span className="text-sm">Search:</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);  // 검색 시 1페이지로 돌아가기
                        }}
                        className="border border-gray-300 rounded p-1 text-xs"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                    <tr>
                        <th className="py-3 px-2 text-center">ID</th>
                        <th className="py-3 px-2 text-center">권한</th>
                        <th className="py-3 px-2 text-center">PW</th>
                        <th className="py-3 px-2 text-center">이름</th>
                        <th className="py-3 px-2 text-center">Email</th>
                        <th className="py-3 px-2 text-center">전화번호</th>
                        <th className="py-3 px-2 text-center">주소</th>
                        <th className="py-3 px-2 text-center">생년월일</th>
                        <th className="py-3 px-2 text-center">성별</th>
                        <th className="py-3 text-center">생성일</th>
                        <th className="py-3 text-center">수정일</th>
                        <th className="py-3 px-3 text-center">작업</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-xs">
                    {paginatedMembers.length > 0 ? (
                        paginatedMembers.map((item, index) => (
                            <tr key={item.userId || index}
                                className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-2 text-center">{item.userId || ''}</td>
                                <td className="py-3 px-2 truncate">{item.authorityId || ''}</td>
                                <td className="py-3 px-2 truncate">{item.userPw || ''}</td>
                                <td className="py-3 px-2 truncate">{item.name || ''}</td>
                                <td className="py-3 px-2 truncate">{item.email || ''}</td>
                                <td className="py-3 px-2 truncate">{item.phone || ''}</td>
                                <td className="py-3 px-2 truncate">{item.address || ''}</td>
                                <td className="py-3 px-2 truncate">{item.birth || ''}</td>
                                <td className="py-3 px-2 truncate">{item.gender || ''}</td>
                                <td className="py-3 text-center">{item.registerDate || ''}</td>
                                <td className="py-3 text-center">{item.modifiedDate || ''}</td>
                                <td className="py-3 text-center">
                                    <button onClick={() => handleEditClick(item)}
                                            className="text-blue-500 hover:text-blue-700 mr-2">
                                        수정
                                    </button>
                                    <button onClick={() => handleDeleteClick(item.userId)}
                                            className="text-red-500 hover:text-red-700">
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="py-3 px-3 text-center">No data available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-8">
                <div className="text-xs">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMembers.length)} of {filteredMembers.length} entries
                </div>
                <div className="flex justify-center space-x-1 dark:text-gray-800">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        title="previous"
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md dark:bg-gray-50 dark:border-gray-100"
                    >
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"
                             strokeLinecap="round"
                             strokeLinejoin="round" className="w-4">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    {[...Array(totalPages).keys()].map(pageNumber => (
                        <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber + 1)}
                            type="button"
                            title={`Page ${pageNumber + 1}`}
                            className={`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md dark:bg-gray-50 dark:text-violet-600 dark:border-violet-600 ${currentPage === pageNumber + 1 ? 'bg-gray-300' : ''}`}
                        >
                            {pageNumber + 1}
                        </button>
                    ))}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        title="next"
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md dark:bg-gray-50 dark:border-gray-100"
                    >
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"
                             strokeLinecap="round"
                             strokeLinejoin="round" className="w-4">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            <Modal isOpen={editingMember} onClose={handleCancelEdit}>
                <EditMember
                    member={editingMember}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            </Modal>
        </div>
    );
};

export default Management;

