import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useHistory, useLocation} from "react-router-dom";
import {file} from "tailwindcss/lib/cli/colors";
import {serveFile} from "socket.io/dist/uws";


function BoardModify() {
    const history = useHistory();

    // postId, boardId, userId 받기
    const location = useLocation();
    const {postId, boardId, userId} = location.state || {};

    // 상태 변수
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [files, setFiles] = useState([]);

    // 핸들러
    const updateTitleOnChangeHandler = useCallback((e) => {
        setUpdateTitle(e.target.value);
    }, [])

    const updateContentOnChangeHandler = useCallback((e) => {
        setUpdateContent(e.target.value);
    }, [])

    const updateFilesOnChangeHandler = useCallback((e) => {
        const selectedFiles = Array.from(e.target.files);

        // 중복 파일 처리
        const newFiles = selectedFiles.filter(selectedFiles =>
            !files.some(file => file.fileName === selectedFiles.name)
        );

        if (newFiles.length > 0) {
            const mappedFiles = selectedFiles.map((v, i) => ({
                fileId: Date.now() + i, // 고유 ID 생성
                fileName: v.name,
                fileObject: v
            }));

            // 기존 파일에 추가 첨부한 파일 합치기
            setFiles((prevFiles) => [...prevFiles, ...mappedFiles]);
        }

        // 파일 입력 요소 리셋
        e.target.value = null;

    }, [files])

    // DB 통신
    useEffect(() => {
        getNoticePostView();
        getFileView();
    }, [])

    // 클릭한 게시글 정보 불러오기
    const getNoticePostView = async () => {
        try {
            const res = await axios.get(`/board-modify?postId=${postId}`);
            setUpdateTitle(res.data.title); // 새로 입력한 제목으로 변경
            setUpdateContent(res.data.content); // 새로 입력한 내용으로 변경
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 클릭한 게시글 첨부파일 불러오기
    const getFileView = async () => {
        try {
            const res = await axios.get(`/files?&postId=${postId}`);
            const files = res.data;
            const mappedFiles = files.map((v, i) => ({
                fileId: v.fileId,
                fileName: v.originalName,
                fileObject: v
            }));

            setFiles(mappedFiles);

        } catch (error) {
            console.log("Error: ", error)
        }
    }

    // 게시글 수정
    const goModifyPost = async () => {
        alert("게시글이 수정되었습니다.")

        const formData = new FormData();
        formData.append('title', updateTitle);
        formData.append('content', updateContent);
        formData.append('postId', postId);
        formData.append('boardId', boardId);

        files.forEach((file) => {
            formData.append('files', file.fileObject);
        });

        try {
            const res = await axios.post("/board-modify", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            if (res.data.result == "success") {
                history.push(`/app/board-detail?postId=${postId}&boardId=${boardId}&userId=${userId}`);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // 첨부파일 삭제
    const fileDelete = async (fileId) => {
        setFiles((prevFiles) => prevFiles.filter(file => file.fileId !== fileId))

        try {
            const res = await axios.get(`/file-delete?fileId=${fileId}`);

            if (res.data.result == "failure") {
                setFiles((prevFiles) => prevFiles.filter(file => file.fileId !== fileId))
            }

        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return <>
        <div className="sm:px-6 w-full h-auto bg-white shadow-md rounded-lg mt-6 mb-6" style={{fontFamily: "Pretendard-Regular"}}>
            <div className="mt-6 md:py-7 px-4 md:px-8 xl:px-24 mb-8">
                <div className="flex justify-center">
                    <p className="text-3xl">
                        {
                            boardId == 1 ? "공지게시판" : boardId == 2 ? "자료게시판" : boardId == 3 ? "건의게시판" : null
                        } - 수정
                    </p>
                </div>
                <p className="border mt-6"></p>

                <form>
                    <div
                        className="mb-12 mt-10 editor mx-auto flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg">
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">제목</div>
                        </div>
                        <input onChange={updateTitleOnChangeHandler}
                               className="rounded-lg focus:bg-white title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
                               spellCheck="false"
                               type="text" value={updateTitle}/>
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">내용</div>
                        </div>
                        <textarea onChange={updateContentOnChangeHandler}
                                  className="mb-3 focus:bg-white rounded-lg description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
                                  rows="10"
                                  spellCheck="false" value={updateContent}>
                        </textarea>

                        {/* 새로 등록한 첨부파일 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">첨부파일</div>
                        </div>
                        <input onChange={updateFilesOnChangeHandler}
                               name="files"
                               className="px-8 py-8 rounded-lg outline-none border-2 border-dashed dark:border-gray-300 dark:text-gray-600 dark:bg-gray-100"
                               spellCheck="false"
                               multiple
                               type="file"/>

                        {/* 기존 파일 */}
                        {
                            files.map((v, i) => {
                                return (
                                    <ul key={i}
                                        className="px-8 py-6 rounded-lg outline-none border-2 border-dashed dark:border-gray-300 dark:text-gray-600 dark:bg-gray-100">
                                        <div className="flex justify-between">
                                            <div className="flex">
                                                <svg className="z-10 w-6 h-6 mr-1 text-gray-400" fill="currentColor"
                                                     viewBox="0 0 20 20"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                                                </svg>
                                                <li>{v.fileName}</li>
                                            </div>
                                            <div>
                                                <button type="button" onClick={() => fileDelete(v.fileId)}>X</button>
                                            </div>
                                        </div>
                                    </ul>
                                )
                            })
                        }

                        <div className="buttons flex mt-6">
                            <button type="button" onClick={goModifyPost}
                                    className="rounded-lg btn border border-yellow-100 p-1 px-4 cursor-pointer text-black bg-yellow-200 ml-auto">수정
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

    </>
}

export default BoardModify