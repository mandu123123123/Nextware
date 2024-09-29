import React, {useCallback, useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment";

function BoardNew() {
    const history = useHistory();

    // boardId, userId 받기
    const location = useLocation();
    const {boardId, userId} = location.state || {};

    // 상태 변수
    const [title, setTitle] = useState(""); // 입력한 제목
    const [content, setContent] = useState(""); // 입력한 내용
    const [files, setFiles] = useState([]); // 첨부한 파일

    // 핸들러
    const titleOnChangeHandler = useCallback((e) => {
        setTitle(e.target.value);
    }, []);

    const contentOnChangeHandler = useCallback((e) => {
        setContent(e.target.value);
    }, []);

    const fileOnChangeHandler = useCallback((e) => {
        setFiles(Array.from(e.target.files));
    }, []);

    const formData = new FormData();
    formData.append('boardId', boardId);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('userId', userId);

    files.forEach((file) => {
        formData.append('files', file);
    });

    // 게시글 등록
    const goAddPost = async (e) => {
        if (title == "") {
            alert("제목을 입력해 주세요.")
            return;
        }
        if (content == "") {
            alert("내용을 입력해 주세요.")
            return;
        }

        alert("게시글이 등록되었습니다.");

        try {
            const res = await axios.post("/board-new", formData, {
                headers : {
                    "Content-Type" : "multipart/form-data",
                },
            })
            console.log(res.data);
            if(res.data.result == "success") {
                if(res.data.boardId == 1) {
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

    return <>
        <div className="sm:px-6 w-full bg-white shadow-md rounded-lg mt-6" style={{fontFamily: "Pretendard-Regular", height: '50rem'}}>
            <div className="px-4 md:py-7 mt-8 pb-0 mr-20 ml-20">
                <div className="flex justify-center">
                    <p className="text-3xl">
                        {
                            boardId == 1 ? "공지게시판" : boardId == 2 ? "자료게시판" : boardId == 3 ? "건의게시판" : null
                        } - 등록
                    </p>
                </div>
                <p className="border mt-6"></p>
            </div>
            <div className="md:py-7 px-4 md:px-8 xl:px-24">
                <form>
                    <div
                        className="mt-10 editor mx-auto flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg">

                        {/* 제목 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">제목</div>
                        </div>
                        <input onChange={titleOnChangeHandler} value={title}
                               className="rounded-lg focus:bg-white title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
                               spellCheck="false"
                               placeholder="Title" type="text"/>

                        {/* 내용 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">내용</div>
                        </div>
                        <textarea onChange={contentOnChangeHandler} value={content}
                                  className="mb-3 focus:bg-white rounded-lg description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
                                  rows="10"
                                  spellCheck="false" placeholder="Content">
                        </textarea>

                        {/* 첨부파일 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs">첨부파일</div>
                        </div>
                        <input onChange={fileOnChangeHandler}
                               className="px-8 py-8 rounded-lg outline-none border-2 border-dashed dark:border-gray-300 dark:text-gray-600 dark:bg-gray-100"
                               spellCheck="false"
                               multiple
                               type="file"/>

                        {/* 등록 */}
                        <div className="buttons flex justify-end mt-6">
                            {
                                boardId == 1 ? <button type="button" onClick={goAddPost}
                                                       className="rounded-lg btn border border-pink-300 p-1 px-4 cursor-pointer text-white ml-2 bg-pink-300 shadow-md">등록
                                </button> : boardId == 2 ? <button type="button" onClick={goAddPost}
                                                                   className="rounded-lg btn border border-purple-300 p-1 px-4 cursor-pointer text-white ml-2 bg-purple-300 shadow-md">등록
                                </button> : boardId == 3 ? <button type="button" onClick={goAddPost}
                                                                   className="rounded-lg btn border border-blue-300 p-1 px-4 cursor-pointer text-white ml-2 bg-blue-300 shadow-md">등록
                                </button> : null
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
}

export default BoardNew