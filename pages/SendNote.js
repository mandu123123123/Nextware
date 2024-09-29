import React, {useCallback, useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import axios from "axios";
import {
    Button
} from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import Cookies from "js-cookie";
import moment from "moment";

function SendNote() {
    const history = useHistory();
    const [cookie, setCookie] = useState("");
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const sendUserId = queryParams.get('sendUserId');
    const receiveUserId = queryParams.get('receiveUserId');
    const responseId = queryParams.get('responseId');

    useEffect(() => {
        const cookieValue = Cookies.get("userinfo")
        // URL 디코딩
        const decodedValue = decodeURIComponent(cookieValue);
        // JSON 파싱
        const userInfo = JSON.parse(decodedValue);
        setCookie(userInfo.userId)

        if(sendUserId){
            setReceiveId(sendUserId)
        }else if(receiveUserId){
            setReceiveId(receiveUserId)
        }else if(responseId){
            setReceiveId(responseId)
        }
    }, []);

    useEffect(() => {
        if(cookie){
            getUserList()
        }
    }, [cookie]);

    // 상태 변수
    const [receiveId, setReceiveId] = useState(""); // 받는 사람 아이디
    const [title, setTitle] = useState(""); // 입력한 제목
    const [content, setContent] = useState(""); // 입력한 내용
    const [userList, setUserList] = useState([])

    // 핸들러
    const receiveIdOnChangeHandler = useCallback((e) => {
        setReceiveId(e.target.value);
    }, []);

    const titleOnChangeHandler = useCallback((e) => {
        setTitle(e.target.value);
    }, []);

    const contentOnChangeHandler = useCallback((e) => {
        setContent(e.target.value);
    }, []);

    const selectUserHandler = useCallback((e) => {
        setReceiveId(e.target.value);
    }, [])

    useEffect(() => {
        console.log(receiveId)
    }, [receiveId]);

    const sendNote = async() => {
        if(!receiveId){
            alert("받는 사람 아이디를 입력하세요.")
            return;
        }
        if(!title){
            alert("제목을 입력하세요.")
            return;
        }
        if(!content){
            alert("내용을 입력하세요.")
            return;
        }
        const res = await axios.post("/note/insert", {sender: cookie, receiver: receiveId, title: title, content: content, sendDate: moment(new Date()).format("yyyy-MM-DD"), deleteYN: "N",
            readYN: "N"
        })
        console.log(res.data)
        if(res.data){
            alert("쪽지를 보냈습니다.")
        }
        history.goBack();
    }
    
    const getUserList = async () => {
        const res = await axios.post("/user/select", {userId: cookie})
        setUserList(res.data)
    }

    return <div style={{fontFamily: "Pretendard-Regular", height: '52rem'}} className="bg-white rounded-lg shadow-md mt-6">
        <div className="sm:px-6 w-full">
            <div className="flex justify-center mt-8">
                <p className="text-3xl">쪽지 쓰기</p>
            </div>
            <p className="border mt-6 mr-8 ml-8"></p>
            <div className="py-4 md:py-7 px-4 md:px-8 xl:px-12">
                <form>
                    <div
                        className="mb-12 mt-6 editor mx-auto flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg">

                        {/* 받는 사람 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs font-semibold">받는 사람</div>
                        </div>
                        {responseId || receiveUserId || sendUserId ? <input onChange={receiveIdOnChangeHandler}
                                                                            value={responseId ? responseId : (receiveUserId ? receiveUserId : (sendUserId ? sendUserId : receiveId))}
                                                                            className="w-1/4 rounded-lg truncate title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
                                                                            spellCheck="false"
                                                                            disabled
                                                                            placeholder="아이디를 입력하세요." type="text"/> :
                            <select id="selectUser"
                                    onChange={selectUserHandler}
                                    value={receiveId}
                                    className="bg-gray-100 outline-none truncate border-gray-300 px-4 py-2 mb-4 rounded-lg w-1/4 cursor-pointer">
                                <option value="">아이디를 선택하세요.</option>
                                {userList ? userList.map((v, i) => {
                                    return (
                                        <option value={`${v.userId}`} key={i}>{v.userId}
                                        </option>
                                    )
                                }) : ""}
                            </select>}

                        {/* 제목 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs font-semibold">제목</div>
                        </div>
                        <input onChange={titleOnChangeHandler} value={title}
                               className="rounded-lg title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none focus:bg-white"
                               spellCheck="false"
                               placeholder="제목을 입력하세요." type="text"/>

                        {/* 내용 */}
                        <div className="icons flex text-gray-500 m-2">
                            <div className="count text-gray-400 text-xs font-semibold">내용</div>
                        </div>
                        <textarea onChange={contentOnChangeHandler} value={content}
                                  className="focus:bg-white mb-3 rounded-lg description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
                                  rows="13"
                                  spellCheck="false" placeholder="내용을 입력하세요.">
                        </textarea>

                        {/* 보내기 */}
                        <div style={{display: "flex", justifyContent: "end"}} className="sm:block mt-3">
                            <Button onClick={() => history.goBack()} layout="outline">
                                취소
                            </Button>
                            <button type="button"
                                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-400 border border-transparent active:bg-blue-600 hover:bg-blue-500 focus:shadow-outline-purple ml-3"
                                    onClick={sendNote}>보내기
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default SendNote