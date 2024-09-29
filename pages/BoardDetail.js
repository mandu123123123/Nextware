import React, {useCallback, useEffect, useState} from "react";
import axios, {post} from "axios";
import {useHistory, useLocation} from "react-router-dom";
import Cookies from "js-cookie";
import moment from "moment/moment";
import Modal from "react-modal";

function BoardDetail() {
    const history = useHistory();
    const location = useLocation();

    // 파라미터에서 boardId, postId 받기
    const queryParams = new URLSearchParams(location.search);
    const boardId = queryParams.get('boardId');
    const postId = queryParams.get('postId');
    const writer = queryParams.get('userId');

    // 상태 변수
    const [userId, setUserId] = useState([]); // 로그인한 유저 아이디
    const [authorityId, setAuthorityId] = useState([]); // 로그인한 유저 권한

    const [postView, setPostView] = useState([]); // 게시글 정보
    const [comment, setComment] = useState(""); // 입력한 댓글
    const [commentList, setCommentList] = useState([]); // 댓글 정보
    const [files, setFiles] = useState([]); // 파일

    const [postDeleteConfirm, setPostDeleteConfirm] = useState(false); // 게시글 삭제 모달
    const [commentDeleteConfirm, setCommentDeleteConfirm] = useState(false); // 댓글 삭제 모달
    const [commentIdToDelete, setCommentIdToDelete] = useState(null); // 삭제할 댓글 ID 저장

    // 모달 스타일 설정
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "Pretendard-Regular",
            borderRadius: '10px',
        },
    };

    // 핸들러
    const commentOnChangeHandler = useCallback((e) => {
        setComment(e.target.value);
    }, [])

    // 화면 로딩됐을 때
    useEffect(() => {
        // DB 통신
        getPostView(); // 게시글 가져오기
        getCommentList(); // 댓글 가져오기
        getFileView(); // 파일 가져오기

        // 쿠키에서 로그인한 유저 정보 가져오기
        const cookie = JSON.parse(Cookies.get('userid'));

        // userId, authorityId 가져와서 변수에 저장
        setUserId(cookie.userId || 'No cookie found');
        setAuthorityId(cookie.authorityId || 'No cookie found');
    }, [])

    // 클릭한 게시글 불러오기
    const getPostView = async () => {
        try {
            const res = await axios.get(`/board-detail?boardId=${boardId}&postId=${postId}`);
            setPostView(res.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 클릭한 게시글 첨부파일 불러오기
    const getFileView = async () => {
        try {
            const res = await axios.get(`/files?boardId=${boardId}&postId=${postId}`);
            setFiles(res.data);
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    // 클릭한 파일 다운로드
    const fileDownload = async (fileId) => {
        try {
            const res = await axios.get(`/download/${fileId}`, {
                responseType: 'blob'
            });

            const disposition = res.headers['content-disposition']; // 헤더 값 가져오기
            let filename = 'default-filename.txt'; // 기본 파일 이름 설정

            if (disposition && disposition.indexOf('attachment') !== -1) {
                // 파일 이름 추출하기 위해 정규 표현식 정의
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                // 파일 이름 찾고 배열에 저장
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, ''); // 파일 이름에서 따옴표 제거
                }

                filename = decodeURIComponent(filename); // 원래 파일 이름으로 디코딩
            }

            // blob 객체를 URL로 변환 후 다운로드
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a'); // a태그 생성
            link.href = url; // href 값 url로 설정
            link.setAttribute('download', filename); // 다운로드 시 파일 이름 설정
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.log("Error: ", error)
        }
    }

    // 게시글 목록으로 돌아가기
    const goPostList = () => {
        if (boardId == 1) {
            history.push("/app/notice-board");
        } else if (boardId == 2) {
            history.push("/app/data-board");
        } else {
            history.push("/app/tendinous-board");
        }
    }

    // 게시글 삭제
    const goDeletePost = async () => {
        setPostDeleteConfirm(true);
        try {
            const res = await axios.get(`/board-delete?boardId=${boardId}&postId=${postId}`)
            if (res.data.result == "success") {
                if (res.data.boardId == 1) {
                    history.push("/app/notice-board");
                } else if (res.data.boardId == 2) {
                    history.push("/app/data-board");
                } else {
                    history.push("/app/tendinous-board");
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 게시글 삭제 눌렀을 때 모달창 띄우기
    const handlePostDeleteClick = (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        setPostDeleteConfirm(true);
    };

    // 게시글 삭제 확인했을 때 지우기
    const handlePostConfirm = () => {
        setPostDeleteConfirm(false);
        goDeletePost();
    };

    // 게시글 삭제 취소했을 때 모달창 닫기
    const handlePostCancel = () => {
        setPostDeleteConfirm(false);
    };

    // 게시글 수정 버튼 눌렀을 때 수정 페이지로 이동
    const goModifyPost = () => {
        history.push(`/app/board-modify`, {postId: postId, boardId: boardId, userId: userId});
    }

    /*     댓글     */

    // 클릭한 게시글의 댓글들 불러오기
    const getCommentList = async () => {
        try {
            const res = await axios.get(`/comment?postId=${postId}`);
            setCommentList(res.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 댓글 등록
    const goAddComment = async () => {
        if (comment == "") {
            alert("댓글을 입력해 주세요");
            return;
        }
        try {
            const res = await axios.post(`/comment-new`, {postId: postId, comment: comment, userId: userId})
            if (res.data.result == "success") {
                await getCommentList();
                setComment("");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 댓글 삭제
    const goDeleteComment = async () => {
        try {
            const res = await axios.get(`/comment-delete?commentId=${commentIdToDelete}`)
            if (res.data.result == "success") {
                await getCommentList();
                setComment("");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 댓글 삭제 눌렀을 때 모달창 띄우기
    const handleCommentDeleteClick = (e) => {
        setCommentIdToDelete(e.commentId);
        setCommentDeleteConfirm(true);
    };

    // 댓글 삭제 확인했을 때 지우기
    const handleCommentConfirm = () => {
        setCommentDeleteConfirm(false);
        goDeleteComment(commentIdToDelete);
    };

    // 댓글 삭제 취소했을 때 모달창 닫기
    const handleCommentCancel = () => {
        setCommentDeleteConfirm(false);
        setCommentIdToDelete(null);
    };

    return <>
        <div className="sm:px-6 w-full mt-4 mb-6 bg-white rounded-lg shadow-md"
             style={{fontFamily: "Pretendard-Regular"}}>
            <div className="px-4 py-4 md:py-7 mt-4 pb-0 mr-20 ml-20">
                <div className="flex justify-center">
                    <p className="text-3xl">
                        {
                            boardId == 1 ? "공지게시판" : boardId == 2 ? "자료게시판" : boardId == 3 ? "건의게시판" : null
                        }
                    </p>
                </div>
                <p className="border mt-6"></p>
            </div>

            <div className="flex justify-between items-center px-24">
                {
                    boardId == 1 ? <button onClick={goPostList}
                                           className="ml-1 mt-3 items-center rounded-lg btn border border-pink-200 p-1 px-4 cursor-pointer text-black bg-pink-200 shadow-md">목록
                    </button> : boardId == 2 ? <button onClick={goPostList}
                                                       className="ml-1 mt-3 items-center rounded-lg btn border border-purple-200 p-1 px-4 cursor-pointer text-black bg-purple-200 shadow-md">목록
                    </button> : <button onClick={goPostList}
                                        className="ml-1 mt-3 items-center rounded-lg btn border border-blue-200 p-1 px-4 cursor-pointer text-black bg-blue-200 shadow-md">목록
                    </button>
                }
                <div className="flex mt-2 mr-6 items-center">
                    <p className="mr-4 text-sm">작성자: {postView.userId}</p>
                    <p className="mr-4 text-sm">작성일: {moment(postView.registerDate).format('YYYY-MM-DD HH:mm')}</p>
                    <p className="text-sm">조회수: {postView.hits}</p>
                </div>
            </div>

            <div className="py-4 md:py-7 px-4 md:px-8 xl:px-24 mb-6 pt-0">
                <form>
                    <div
                        className="mb-12 mt-3 editor mx-auto flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg">
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">제목</div>
                        </div>
                        <input className="rounded-lg title bg-white border border-gray-300 p-2 mb-4 outline-none"
                               spellCheck="false"
                               readOnly
                               type="text" value={postView.title}/>
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">내용</div>
                        </div>
                        <textarea
                            className="mb-3 rounded-lg description bg-white sec p-3 h-60 border border-gray-300 outline-none"
                            rows="14"
                            readOnly
                            spellCheck="false" value={postView.content}>
                        </textarea>

                        {/* 등록된 첨부파일 보여줘야 됨 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">첨부파일</div>
                        </div>
                        <div
                            className="px-8 py-10 rounded-lg outline-none border-2 border-dashed dark:border-gray-300 dark:text-gray-600 dark:bg-gray-100">

                            {
                                files.map((v, i) => {
                                    return (
                                        <div className="flex" key={i}>
                                            <svg className="z-10 w-6 h-6 mr-1 text-gray-400" fill="currentColor"
                                                 viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                                            </svg>
                                            <a href="#" className="underline"
                                               onClick={() => fileDownload(v.fileId)}>{v.originalName}</a>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* 권한에 따라 수정, 삭제 버튼 처리 */}
                        {
                            (writer === userId || authorityId === "A001") && (
                                <>
                                    <div className="buttons flex mt-6">
                                        <button onClick={goModifyPost}
                                                className="rounded-lg btn border border-yellow-200 p-1 px-4 cursor-pointer text-black bg-yellow-200 ml-auto shadow-md">수정
                                        </button>
                                        <form onSubmit={handlePostDeleteClick}>
                                            <button type="submit"
                                                    className="rounded-lg btn border border-red-600 p-1 px-4 cursor-pointer text-gray-200 ml-2 bg-red-600 shadow-lg">삭제
                                            </button>
                                        </form>
                                    </div>
                                    <Modal isOpen={postDeleteConfirm} onRequestClose={handlePostCancel}
                                           style={customStyles}>
                                        <div className="text-lg mb-4">⚠️ 게시글을 삭제하시겠습니까?</div>
                                        <div className="flex justify-end">
                                            <button onClick={handlePostCancel}
                                                    className="btn-cancel btn-confirm rounded-lg btn border border-gray-400 p-1 px-3 cursor-pointer text-white ml-2 bg-gray-400">취소
                                            </button>
                                            <button onClick={handlePostConfirm}
                                                    className="btn-confirm rounded-lg btn border border-red-500 p-1 px-3 cursor-pointer text-white ml-2 bg-red-600">확인
                                            </button>
                                        </div>
                                    </Modal>
                                </>
                            )
                        }
                    </div>
                </form>

                {/* 댓글 */}
                <form className="w-full bg-white rounded-lg">
                    <div className="border"></div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">댓글</h2>
                        <div className="w-full md:w-full px-3 mb-2 mt-2 flex">
                                <textarea onChange={commentOnChangeHandler} value={comment}
                                          className="bg-gray-100 rounded border border-gray-300 leading-normal resize-none w-full h-20 py-2 px-3 focus:outline-none focus:bg-white"
                                          name="body" placeholder='댓글을 입력하세요.' required></textarea>
                            <button onClick={goAddComment} type="button"
                                    className="rounded-lg btn border border-green-300 p-1 px-4 cursor-pointer text-black ml-2 bg-green-300 shadow-md">등록
                            </button>
                        </div>
                    </div>
                </form>

                {
                    commentList.map((v, i) => {
                        return (
                            <>
                                <div className="flex mt-6 mb-4" key={i}>
                                    <div className="flex-shrink-0 mr-3">
                                        <img className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
                                             src="/profile-icon.png"
                                             alt=""/>
                                    </div>
                                    <div className="flex-1 border rounded-lg px-4 py-2 sm:px-5 sm:py-4 leading-relaxed">
                                        <strong className="mr-1">{v.userId}</strong> <span
                                        className="text-xs text-gray-400">{moment(v.registerDate).format('yyyy-MM-DD HH:mm')}</span>
                                        <div className="flex justify-between">
                                            <p className="mt-2">
                                                {v.comment}
                                            </p>
                                            {/* 권한에 따라 삭제 버튼 처리 */}
                                            {
                                                (v.userId === userId || authorityId === "A001") && (
                                                    <>
                                                        <button
                                                            onClick={() => handleCommentDeleteClick({commentId: v.commentId})}
                                                            className="text-slate-500 w-3">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                className="h-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <Modal isOpen={commentDeleteConfirm}
                                                               onRequestClose={handleCommentCancel} style={customStyles}>
                                                            <div className="text-lg mb-4">⚠️ 댓글을 삭제하시겠습니까?</div>
                                                            <div className="flex justify-end">
                                                                <button onClick={handleCommentCancel}
                                                                        className="btn-cancel btn-confirm rounded-lg btn border border-gray-400 p-1 px-3 cursor-pointer text-white ml-2 bg-gray-400">취소
                                                                </button>
                                                                <button onClick={handleCommentConfirm}
                                                                        className="btn-confirm rounded-lg btn border border-red-600 p-1 px-3 cursor-pointer text-white ml-2 bg-red-600">확인
                                                                </button>
                                                            </div>
                                                        </Modal>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }
                {/* 댓글 */}
            </div>
        </div>

    </>
}

export default BoardDetail