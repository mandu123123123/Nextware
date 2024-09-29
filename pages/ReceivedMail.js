import React, {useEffect, useState} from "react";
import PageTitle from "../components/Typography/PageTitle";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Dropdown,
    DropdownItem
} from "@windmill/react-ui";
import Cookies from "js-cookie";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

function ReceivedMail() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [cookie, setCookie] = useState("")

    function closeModal() {
        setIsModalOpen(false);
        if(isRecent){
            selectList();
        }
        else if(isOld){
            selectOldList()
        }
    }

    /* 로그인정보체크 */
    useEffect(() => {
        getCookieData()
        if(cookie){
            selectList()
        }
    }, []);

    const getCookieData = async () => {
        const cookieValue = Cookies.get("userinfo")
        if(cookieValue){
            const userInfo = await JSON.parse(cookieValue); // JSON 파싱
            setCookie(userInfo.userId)
        }
    }

    useEffect(() => {
        if(cookie){
            selectList()
        }
    }, [cookie])

    const history = useHistory();
    const [sender, setSender] = useState("")
    const [sendDate, setSendDate] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [responseId, setResponseId] = useState(0)
    const [noteList, setNoteList] =useState([])
    const [oldNoteList, setOldNoteList] =useState([])

    const [notReadCount, setNotReadCount] = useState(0);
    const [isRecent, setIsRecent] = useState(false);

    const [isOld, setIsOld] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [perPage, setPerPage] = useState(12); // 보여줄 개수
    const [totalCount, setTotalCount] = useState(0); // 불러온 게시글 총 개수
    const totalPages = Math.ceil(totalCount / perPage);

    // 조회
    const selectList = async () => {
        const res = await axios.post("/receiveNote/selects", {userId: cookie, currentPage: currentPage, perPage: perPage})
        setNoteList(res.data.receiveNotes)
        setTotalCount(res.data.totalCount);
        setIsRecent(true)
        setIsOld(false)
        setIsDropdownOpen(false)
    }

    // 과거순 조회
    const selectOldList = async () => {
        const res = await axios.post("/oldReceiveNote/selects", {userId: cookie, currentPage: currentPage, perPage: perPage})
        setOldNoteList(res.data.oldReceiveNotes)
        setTotalCount(res.data.totalCount);
        setIsRecent(false)
        setIsOld(true)
        setIsDropdownOpen(false)
    }

    useEffect(() => {
        if(cookie){
            if(isRecent){
                selectList();
            }
            else if(isOld){
                selectOldList()
            }
        }
    }, [currentPage])

    // 글보기로 이동
    const goView = async (data) => {
        setIsModalOpen(true)
        setSender(data.sender)
        setSendDate(data.sendDate)
        setTitle(data.title)
        setContent(data.content)
        setResponseId(data.responseId)

        const res = await axios.post("/receiveNote/update", {responseId: data.responseId})
        if(isRecent){
            selectList();
        }
        else if(isOld){
            selectOldList()
        }
    }

    // 읽음 표시
    const readNote = async(data) => {
        const res = await axios.post("/receiveNote/update", {responseId: data.responseId})
        if(isRecent){
            selectList();
        }
        else if(isOld){
            selectOldList()
        }
    }

    // 안 읽음 표시
    const notReadNote = async(data) => {
        const res = await axios.post("/receiveNotReadNote/update", {responseId: data.responseId})
        if(isRecent){
            selectList();
        }
        else if(isOld){
            selectOldList()
        }
    }

    // 쪽지 삭제
    const deleteReceive = async () => {
        alert("쪽지가 삭제되었습니다.")
        const res = await axios.post(`/responseNote/delete?responseId=${responseId}`)
        setIsModalOpen(false)
        if(isRecent){
            selectList();
        }
        else if(isOld){
            selectOldList()
        }
    }

    // 전체 삭제
    const deleteAll = async () => {
        if(selectedIds.length == 0){
            alert("삭제할 쪽지를 선택하세요.")
        }else {
            alert("쪽지가 삭제되었습니다.");
            // 선택된 항목들(selectedIds)에 대해 삭제 로직을 구현할 수 있습니다.
            for (let id of selectedIds) {
                await axios.post(`/responseNote/delete?responseId=${id}`);
            }
            // 삭제 후 리스트를 다시 불러옵니다.
            if(isRecent){
                selectList();
            }
            else if(isOld){
                selectOldList()
            }
            setSelectedIds([]); // 선택된 항목들을 초기화
        }
    };

    // 체크된거 저장하기
    const [selectedIds, setSelectedIds] = useState([]);

    const checkboxChange = (event) => {
        const { value, checked } = event.target;
        const intValue = parseInt(value);

        if (checked) {
            setSelectedIds([...selectedIds, intValue]);
        } else {
            setSelectedIds(selectedIds.filter((id) => id !== intValue));
        }
    };

    return (
        <div style={{fontFamily: "Pretendard-Regular", height: '50rem'}} className="px-2 bg-white rounded-lg shadow-md mt-6">
            {/*<PageTitle>받은 쪽지함</PageTitle>*/}
            <div className="flex justify-center mt-6">
                <p className="text-3xl">받은 쪽지함</p>
            </div>
            <p className="border mt-4 mr-6 ml-6"></p>
            <div className="mt-4" style={{display: "flex", justifyContent: "space-between"}}>
                <div className="sm:block pl-4">
                    <button onClick={deleteAll}
                            className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-gray-400 border border-transparent active:bg-gray-400 hover:bg-gray-500 focus:shadow-outline-gray">삭제
                    </button>
                </div>
                <div className="sm:block pr-4">
                    <div className="flex">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="inline-flex items-center px-2 py-2 rounded-lg hover:bg-gray-100"
                                style={{outline: 'none', marginTop: '4px'}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-clock" viewBox="0 0 16 16">
                                    <path
                                        d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                                </svg>
                                {isDropdownOpen ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                        <path
                                            d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                    </svg>}
                            </button>
                            {isDropdownOpen && (
                                <Dropdown style={{width: '50px', outline: 'none'}} align="center"
                                          isOpen={isDropdownOpen}
                                          onClose={() => setIsDropdownOpen(false)}>
                                    <DropdownItem style={{outline: 'none'}} tag="button" className={isRecent ? "bg-gray-100" : ""}
                                                  onClick={selectList}>
                                        최신순
                                    </DropdownItem>
                                    <DropdownItem style={{outline: 'none'}} tag="button" className={isOld ? "bg-gray-100" : ""}
                                                  onClick={selectOldList}>
                                        과거순
                                    </DropdownItem>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container p-2 mx-auto sm:p-4 mb-4" style={{height:'36rem'}}>
                <div className="flex flex-col overflow-x-auto text-xs bg-white rounded-lg">
                    <div className="flex text-left bg-purple-100">
                        <div className="flex items-center justify-center w-8 px-2 py-3 sm:p-3">
                            <input type="checkbox" name="All" onChange={(e) => {
                                const checked = e.target.checked;
                                if (checked) {
                                    setSelectedIds(noteList.map(v => v.responseId)); // 모두 선택
                                } else {
                                    setSelectedIds([]); // 모두 해제
                                }
                            }} className="w-3 h-3 rounded-sm cursor-pointer"/>
                        </div>
                        <div className="w-20 px-2 py-3 sm:p-3">보낸 사람</div>
                        <div className="hidden w-24 px-2 py-3 sm:p-3 sm:block text-center">읽음</div>
                        <div className="flex-1 px-2 py-3 sm:p-3 text-center">제목</div>
                        <div className="hidden w-32 px-2 py-3 sm:p-3 sm:block text-center">날짜</div>
                    </div>
                    {isRecent ? noteList.map((v, i) => {
                        return (
                            <div key={i} className="flex border-b border-opacity-20 hover:bg-gray-50">
                                <div className="flex items-center justify-center w-8 px-2 py-3 sm:p-3">
                                    <input type="checkbox" onChange={checkboxChange}
                                           className="w-3 h-3 rounded-sm cursor-pointer" name={`Box${i}`}
                                           checked={selectedIds.includes(v.responseId)} value={v.responseId}/>
                                </div>
                                <div className="w-20 px-2 py-3 truncate sm:p-3">
                                    <span
                                        className={v.readYN == "Y" ? "cursor-pointer hover:font-bold text-gray-400" : "cursor-pointer hover:font-bold"}><Link
                                        to={`/app/send-note?sendUserId=${v.sender}`}>{v.sender}</Link></span>
                                </div>
                                <div className="hidden w-24 px-2 py-3 sm:p-3 sm:block ">
                                    <p className="flex justify-center">{v.readYN == "Y" ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" onClick={() => notReadNote({responseId: v.responseId})}
                                             className="bi bi-envelope-open text-gray-400 cursor-pointer"
                                             viewBox="0 0 16 16">
                                            <path
                                                d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882zM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765z"/>
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" onClick={() => readNote({responseId: v.responseId})} className="bi bi-envelope-fill hover: cursor-pointer text-blue-400" viewBox="0 0 16 16">
                                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                                        </svg>
                                    }</p>
                                </div>
                                <div className="flex-1 block px-2 mx-48 py-3 truncate sm:p-3 sm:w-auto text-center">
                                    <span
                                        className={v.readYN == "Y" ? "cursor-pointer hover:font-semibold text-gray-400" : "cursor-pointer hover:font-semibold"}
                                        onClick={() => goView({
                                            responseId: v.responseId,
                                            sender: v.sender,
                                            sendDate: v.sendDate,
                                            title: v.title,
                                            content: v.content
                                        })}>{v.title}</span>
                                </div>
                                <div className="hidden w-32 px-2 py-3 sm:p-3 sm:block text-center">
                                    <p className={v.readYN == "Y" ? "text-gray-400" : ""}>{v.sendDate}</p>
                                </div>
                            </div>
                        )
                    }) : ""}

                    {isOld ? oldNoteList.map((v, i) => {
                        return (
                            <div key={i} className="flex border-b border-opacity-20 hover:bg-gray-50">
                                <div className="flex items-center justify-center w-8 px-2 py-3 sm:p-3">
                                    <input type="checkbox" onChange={checkboxChange}
                                           className="w-3 h-3 rounded-sm cursor-pointer" name={`Box${i}`}
                                           checked={selectedIds.includes(v.responseId)} value={v.responseId}/>
                                </div>
                                <div className="w-20 px-2 py-3 truncate sm:p-3">
                                    <span
                                        className={v.readYN == "Y" ? "cursor-pointer hover:font-bold text-gray-400" : "cursor-pointer hover:font-bold"}><Link
                                        to={`/app/send-note?sendUserId=${v.sender}`}>{v.sender}</Link></span>
                                </div>
                                <div className="hidden w-24 px-2 py-3 sm:p-3 sm:block ">
                                    <p className="flex justify-center">{v.readYN == "Y" ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" onClick={() => notReadNote({responseId: v.responseId})}
                                             className="bi bi-envelope-open text-gray-400 cursor-pointer"
                                             viewBox="0 0 16 16">
                                            <path
                                                d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882zM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765z"/>
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" onClick={() => readNote({responseId: v.responseId})} className="bi bi-envelope-fill hover: cursor-pointer text-blue-400" viewBox="0 0 16 16">
                                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                                        </svg>
                                    }</p>
                                </div>
                                <div className="flex-1 block px-2 mx-48 py-3 truncate sm:p-3 sm:w-auto text-center">
                                    <span
                                        className={v.readYN == "Y" ? "cursor-pointer hover:font-semibold text-gray-400" : "cursor-pointer hover:font-semibold"}
                                        onClick={() => goView({
                                            responseId: v.responseId,
                                            sender: v.sender,
                                            sendDate: v.sendDate,
                                            title: v.title,
                                            content: v.content
                                        })}>{v.title}</span>
                                </div>
                                <div className="hidden w-32 px-2 py-3 sm:p-3 sm:block text-center">
                                    <p className={v.readYN == "Y" ? "text-gray-400" : ""}>{v.sendDate}</p>
                                </div>
                            </div>
                        )
                    }) : ""}
                </div>
            </div>

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
                            const maxVisiblePages = 3; // 최대 보여줄 페이지 수
                            let pagesToShow = [];

                            // 총 페이지 수가 maxVisiblePages보다 작거나 같은 경우
                            if (totalPages <= maxVisiblePages) {
                                pagesToShow = Array.from({length: totalPages}, (_, i) => i + 1);
                            }

                            // 현재 페이지가 1인 경우
                            if (currentPage === 1) {
                                pagesToShow = [1, 2, 3].slice(0, totalPages);
                            }
                            // 현재 페이지가 마지막 페이지인 경우
                            else if (currentPage === totalPages) {
                                const startPage = currentPage - 1; // 현재 페이지의 이전 페이지부터 시작
                                pagesToShow = Array.from({length: maxVisiblePages}, (_, i) => startPage + i)
                                    .filter(page => page >= 1 && page <= totalPages);
                            }
                            // 그 외의 경우
                            else {
                                const startPage = currentPage - 1; // 현재 페이지의 이전 페이지부터 시작
                                pagesToShow = Array.from({length: maxVisiblePages}, (_, i) => startPage + i)
                                    .filter(page => page >= 1 && page <= totalPages);
                            }

                            // 리턴 부분: pagesToShow 배열을 기반으로 버튼 생성
                            return pagesToShow.map(page => (
                                <li key={page}>
                                    <button
                                        onClick={() => setCurrentPage(page)}
                                        className={`h-10 px-5 transition-colors duration-150 focus:shadow-outline ${currentPage === page ? 'bg-purple-500 text-white border border-transparent' : 'text-gray-600 active:bg-purple-200 hover:bg-purple-100'}`}>
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
            <Modal isOpen={isModalOpen} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                <div className="flex border-b border-opacity-20">
                    <div className="w-32 px-2 py-3 sm:p-3">
                        <span>{"보낸 사람"}</span>
                    </div>
                    <div className="flex-1 block px-2 py-3 truncate sm:p-3 sm:w-auto">
                        <span className="text-gray-500">{sender}</span>
                    </div>
                </div>
                <div className="flex border-b border-opacity-20">
                    <div className="w-32 px-2 py-3 sm:p-3">
                        <span>{"보낸 날짜"}</span>
                    </div>
                    <div className="flex-1 block px-2 py-3 truncate sm:p-3 sm:w-auto">
                        <span className="text-gray-500">{sendDate}</span>
                    </div>
                </div>
                <div className="flex border-b border-opacity-20">
                    <div className="w-32 px-2 py-3 sm:p-3">
                        <span>{"제목"}</span>
                    </div>
                    <div className="flex-1 block px-2 py-3 truncate sm:p-3 sm:w-auto">
                        <span className="text-gray-500">{title}</span>
                    </div>
                </div>
                <div className="flex border-opacity-20 h-64">
                    <div className="w-32 px-2 py-3 sm:p-3">
                        <span>{"내용"}</span>
                    </div>
                    <div className="flex-1 block px-2 py-3 sm:p-3 sm:w-auto">
                        <span className="text-gray-500 break-all overflow-wrap-anywhere">{content}</span>
                    </div>
                </div>
                <ModalFooter>
                    <div style={{display: "flex", justifyContent: "end"}} className="sm:block mt-3">
                        <button
                            className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-gray-400 border border-transparent active:bg-gray-400 hover:bg-gray-500 focus:shadow-outline-gray"
                            onClick={deleteReceive}>삭제
                        </button>
                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-400 border border-transparent active:bg-blue-600 hover:bg-blue-500 focus:shadow-outline-purple ml-3"
                                onClick={() => history.push(`/app/send-note?responseId=${sender}`)}>답장</button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ReceivedMail