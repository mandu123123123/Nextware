import React, {useCallback, useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";


function NoticeBoard() {
    const history = useHistory();

    const boardId = 1; // 공지게시판

    // 상태 변수
    const [noticeBoardList, setNoticeBoardList] = useState([]); // 공지게시판 목록
    const [userId, setUserId] = useState([]); // 로그인한 유저 아이디
    const [authorityId, setAuthorityId] = useState([]); // 로그인한 유저 권한

    const [searchWord, setSearchWord] = useState(""); // 검색어
    const [searchType, setSearchType] = useState("제목"); // 검색 카테고리

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [perPage, setPerPage] = useState(7); // 보여줄 개수
    const [totalCount, setTotalCount] = useState(0); // 불러온 게시글 총 개수
    const totalPages = Math.ceil(totalCount / perPage); // 총 페이지 수

    // 핸들러
    const searchWordOnChangeHandler = useCallback((e) => {
        setSearchWord(e.target.value);
    }, [])

    const searchTypeOnChangeHandler = useCallback((e) => {
        setSearchType(e.target.value);
    }, [])

    // 처음 화면 로딩됐을 때
    useEffect(() => {
        // DB 통신
        getNoticeBoardList();

        // 쿠키에서 로그인한 유저 정보 가져오기
        const cookie = JSON.parse(Cookies.get('userid'));

        // userId, authorityId 가져와서 변수에 저장
        setUserId(cookie.userId || 'No cookie found');
        setAuthorityId(cookie.authorityId || 'No cookie found');
    }, [])

    // 공지게시글 불러오기
    const getNoticeBoardList = async () => {
        try {
            const res = await axios.get(`/board?boardId=${boardId}&currentPage=${currentPage}&perPage=${perPage}&searchType=${searchType}&searchWord=${searchWord}`);
            setNoticeBoardList(res.data.boards);
            setTotalCount(res.data.totalCount);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 페이지 바뀔 때마다 재조회
    useEffect(() => {
        getNoticeBoardList();
    }, [currentPage])

    // 게시글 클릭했을 때
    const postClick = (e) => {
        postClickHitsUpdate(e); // 조회수 증가 함수 호출

        // 클릭한 게시글 상세페이지로 이동
        history.push(`/app/board-detail?boardId=${boardId}&postId=${e.postId}&userId=${e.userId}`);
    }

    // 클릭했을 때만 조회수 증가
    const postClickHitsUpdate = async (e) => {
        try {
            const res = await axios.get(`/update-hits?postId=${e.postId}`);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 등록 버튼 눌렀을 때 공지게시글 등록 페이지로 이동
    const goAddNoticeBoard = () => {
        history.push(`/app/board-new`, {boardId: boardId, userId: userId});
    }

    return (
        <>
            <div className="sm:px-6 w-full bg-white mt-8 rounded-lg shadow-md" style={{fontFamily: "Pretendard-Regular", height: '50rem'}}>
                <div className="px-4 md:px-10 py-2 md:py-7">
                    <div className="flex items-center justify-center">
                        <p tabIndex="0" style={{fontSize: "xx-large"}}
                           className="p-4 rounded-full focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl leading-normal text-gray-800">공지게시판</p>
                    </div>
                    <p className="border mb-3"></p>
                </div>
                <div className="bg-white md:py-7 px-4 md:px-8 xl:px-10">
                    <div className="sm:flex items-center justify-between mb-2">
                        <form>
                            <div
                                className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
                                <div className="mr-2">
                                    <select id="Com"
                                            onChange={searchTypeOnChangeHandler}
                                            value={searchType}
                                            className="cursor-pointer text-base text-gray-800 outline-none shadow-md border-gray-100 px-4 py-2 rounded-lg w-24">
                                        <option value="제목">제목</option>
                                        <option value="작성자">작성자</option>
                                        <option value="내용">내용</option>
                                    </select>
                                </div>
                                <input onChange={searchWordOnChangeHandler} value={searchWord}
                                       className="text-base text-black flex-grow outline-none shadow-md border-gray-100 px-2 rounded-lg"
                                       type="text" placeholder="검색어를 입력하세요."/>
                                <div className="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                    <button onClick={() => getNoticeBoardList()} type="button"
                                            className="bg-pink-300 text-white text-base rounded-lg px-4 py-2 font-thin shadow-md">검색
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* 권한에 따라 등록 버튼 처리 */}
                        {
                            (authorityId === "A001" || authorityId === "A002") && (
                                <button onClick={goAddNoticeBoard}
                                        className="bg-pink-300 text-white text-base rounded-lg px-4 py-2 font-thin shadow-md">등록
                                </button>
                            )
                        }
                    </div>
                    <div className="mt-7 overflow-x-auto">
                        <table className="w-full whitespace-nowrap mb-2">
                            <tbody>
                            <tr className="h-3"></tr>
                            <tr tabIndex="0" className="focus:outline-none border border-gray-100 shadow-md" style={{height: '3.5rem'}}>
                                <td className="pr-5">
                                    <div className="flex items-center pl-5">
                                        <p className="text-base font-medium leading-none text-gray-700 mr-2">번호</p>
                                    </div>
                                </td>
                                <td className="focus:text-indigo-600 ">
                                    <div className="flex items-center pl-5">
                                        <p className="text-base font-medium leading-none text-gray-700 mr-2">제목</p>
                                    </div>
                                </td>
                                <td className="pl-24">
                                </td>
                                <td className="pl-5">
                                    <div className="flex items-center">
                                        <p className="text-base leading-none text-gray-600 ml-2">작성자</p>
                                    </div>
                                </td>
                                <td className="pl-5">
                                </td>
                                <td className="pl-5">
                                    <div className="flex items-center">
                                        <p className="text-base leading-none text-gray-600 ml-2">조회수</p>
                                    </div>
                                </td>
                                <td className="pl-5">
                                </td>
                                <td className="pl-4">
                                    <p className="ml-3">작성일</p>
                                </td>
                            </tr>
                            {
                                noticeBoardList.map((v, i) => {
                                    return (
                                        <>
                                            <tr className="h-3" key={i}></tr>
                                            <tr tabIndex="0"
                                                onClick={() => postClick({postId: v.postId, userId: v.userId})}
                                                className="hover:bg-gray-50 cursor-pointer focus:outline-none shadow-md border-gray-100 border" style={{height: '3.5rem'}}>
                                                <td className="pr-5">
                                                    <div className="flex items-center pl-1">
                                                        <p className="text-base font-medium leading-none text-gray-700 mr-2 ml-4">{totalCount - (((currentPage - 1) * perPage) + i)}</p>
                                                    </div>
                                                </td>
                                                <td className="focus:text-indigo-600 ">
                                                    <div className="flex items-center pl-5">
                                                        <Link
                                                            to={`/app/board-detail?boardId=${boardId}&postId=${v.postId}&userId=${v.userId}`}
                                                            onClick={() => postClick(v.postId)}
                                                            className="text-base font-medium leading-none text-gray-700 mr-2">{v.title}</Link>
                                                    </div>
                                                </td>
                                                <td className="pl-24">
                                                </td>
                                                <td className="pl-5">
                                                    <div className="flex items-center">
                                                        <p className="text-base leading-none text-gray-600 ml-2">{v.userId}</p>
                                                    </div>
                                                </td>
                                                <td className="pl-5">
                                                </td>
                                                <td className="pl-5">
                                                    <div className="flex items-center">
                                                        <p className="text-base leading-none text-gray-600 ml-5">{v.hits}</p>
                                                    </div>
                                                </td>
                                                <td className="pl-5">
                                                </td>
                                                <td className="pl-4">
                                                    <p>{moment(v.registerDate).format('yyyy-MM-DD')}</p>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                        {/* 페이징 */}
                        <div className="bg-white pt-4 flex items-center flex-wrap justify-center">
                            <nav aria-label="Page navigation">
                                <ul className="inline-flex">
                                    <li>
                                        <button onClick={() => {
                                            setCurrentPage(currentPage - 1)
                                        }}
                                                disabled={currentPage === 1}
                                                className="h-10 px-3 text-gray-600 transition-colors duration-150 rounded-l-lg focus:shadow-outline hover:bg-pink-100">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clipRule="evenodd" fillRule="evenodd"></path>
                                            </svg>
                                        </button>
                                    </li>

                                    {
                                        (() => {
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
                                                        className={`h-10 px-5 transition-colors duration-150 focus:shadow-outline ${currentPage === page ? 'bg-pink-400 text-white border border-pink-400' : 'text-gray-600 hover:bg-pink-100'}`}>
                                                        {page}
                                                    </button>
                                                </li>
                                            ));
                                        })()
                                    }

                                    <li>
                                        <button onClick={() => {
                                            setCurrentPage(currentPage + 1)
                                        }}
                                                disabled={currentPage === totalPages}
                                                className="h-10 px-3 text-gray-600 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-pink-100">
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
                </div>
            </div>
        </>
    );
}

export default NoticeBoard;
