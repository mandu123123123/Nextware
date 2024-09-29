import React, {useCallback, useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import PageTitle from "../components/Typography/PageTitle";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@windmill/react-ui";
import axios from "axios";
import Cookies from "js-cookie";

function CalendarEx() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalTeacherEventOpen, setIsModalTeacherEventOpen] = useState(false);
    const [isModalStudentEventOpen, setIsModalStudentEventOpen] = useState(false);
    const [events, setEvents] = useState([])
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [writer, setWriter] = useState("qwe")
    const [scheduleType, setScheduleType] = useState("S001")

    const [updateStartDate, setUpdateStartDate] = useState("")
    const [updateEndDate, setUpdateEndDate] = useState("")
    const [updateTitle, setUpdateTitle] = useState("")
    const [updateContent, setUpdateContent] = useState("")
    const [scheduleId, setScheduleId] = useState("")

    const [teacherOpen, setTeacherOpen] = useState(false)
    const [studentOpen, setStudentOpen] = useState(false)

    const [cookie, setCookie] = useState("")

    function closeModal() {
        setIsModalOpen(false);
        setIsModalTeacherEventOpen(false);
        setIsModalStudentEventOpen(false);
        init()
    }

    const localizer = momentLocalizer(moment);

    // 슬롯 열기
    const clickSlot = () => {
        setIsModalOpen(true);
    }

    // 이벤트 열기
    const clickEvent = (param) => {

        // console.log("=>", param)

        // 학생이면
        if (cookie == "A003") {
            setIsModalStudentEventOpen(true);

            setUpdateStartDate(param.start)
            setUpdateEndDate(param.end)
            setUpdateTitle(param.title)
            setUpdateContent(param.content)
            setScheduleId(param.id)

            init(); //초기화
        } else {
            // 쌤이면
            setIsModalTeacherEventOpen(true);

            setUpdateStartDate(param.start)
            setUpdateEndDate(param.end)
            setUpdateTitle(param.title)
            setUpdateContent(param.content)
            setScheduleId(param.id)

            init(); //초기화
        }
    }

    // 입력란
    const onChangeTitle = useCallback((e) => {
        setTitle(e.target.value)
    }, [])

    const onChangeContent = useCallback((e) => {
        setContent(e.target.value)
    }, [])

    const onChangeStartDate = useCallback((e) => {
        setStartDate(e.target.value)
    }, [])

    const onChangeEndDate = useCallback((e) => {
        setEndDate(e.target.value)
    }, [])

    // 수정 입력란
    const onChangeUpdateTitle = useCallback((e) => {
        setUpdateTitle(e.target.value)
    }, [])

    const onChangeUpdateContent = useCallback((e) => {
        setUpdateContent(e.target.value)
    }, [])

    const onChangeUpdateStartDate = useCallback((e) => {
        setUpdateStartDate(e.target.value)
    }, [])

    const onChangeUpdateEndDate = useCallback((e) => {
        setUpdateEndDate(e.target.value)
    }, [])

    // 캘린더 누르면 조회해서 이벤트 보여주기
    useEffect(() => {
        const cookieValue = Cookies.get("userinfo")
        // URL 디코딩
        const decodedValue = decodeURIComponent(cookieValue);
        // JSON 파싱
        const userInfo = JSON.parse(decodedValue);
        setCookie(userInfo.authorityId)
        getData()

    }, []);

    useEffect(() => {
        if (cookie == "A003") {
            setStudentOpen(true)
        } else {
            setTeacherOpen(true)
        }
    }, [cookie]);

    const getData = async () => {
        const res = await axios.get("/calendar/selects") // 캘린더는 전체를 조회해야 하기 떄문에 파라미터가 없습니다. url과 같은 url을 controller에서 찾아서 실행합니다.

        const date = res.data; // controller에서 받은 데이터입니다.

        const newList = date.map((v, i) => {
            return {
                title: v.title,
                content: v.content,
                id: v.scheduleId,
                start: new Date(v.startDate),
                end: new Date(v.endDate)
            }
        })
        setEvents(newList)
    }

    // 등록
    const register = async () => {
        if (!startDate) {
            alert("시작 일자를 선택하세요.");
            return false;
        }
        if (!endDate) {
            alert("종료 일자를 선택하세요.");
            return false;
        }
        if (!title) {
            alert("제목을 입력하세요.");
            return false;
        }
        if (startDate > endDate) {
            alert("시작 일자가 종료 일자보다 앞서야 합니다.")
        } else {
            alert("일정을 등록하였습니다.")
            closeModal()
            const res = await axios.post("/calendar/insert", { // 입력 받은 데이터들을 post 방식으로 url과 같은 url을 controller에서 찾아서 보냅니다.
                startDate: startDate,
                endDate: endDate,
                title: title,
                content: content,
                writer: writer,
                scheduleType: scheduleType
            })
            console.log(res.data)
            getData(); //재조회
            init(); //초기화
        }
    }

    const updated = async () => {
        if (!updateTitle) {
            alert("제목을 입력하세요.");
            return false;
        }
        if (moment(updateStartDate).format("yyyy-MM-DD") > moment(updateEndDate).format("yyyy-MM-DD")) {
            alert("시작 일자가 종료 일자보다 앞서야 합니다.")
        } else {
            if(updateStartDate && updateStartDate){
                alert("일정이 수정되었습니다.")
                closeModal()
                const res = await axios.post("/calendar/update", { // 수정한 데이터들을 post 방식으로 url과 같은 url을 controller에서 찾아서 보냅니다.
                    startDate: updateStartDate,
                    endDate: updateEndDate,
                    title: updateTitle,
                    content: updateContent,
                    scheduleId: scheduleId
                })
                console.log(res.data)
                getData(); //재조회
                init(); // 초기화
            }
        }
    }

    const deleted = async () => {
        alert("일정이 삭제되었습니다.")
        closeModal()
        const res = await axios.get(`/calendar/delete?scheduleId=${scheduleId}`) // 삭제하려는 데이터의 스케줄 아이디를 화면에서 얻은 후에 get 방식으로 url과 같은 url을 controller에서 찾아서 보냅니다.
        console.log(res.data)
        getData(); //재조회
    }

    // 입력란 초기화
    const init = () => {
        setStartDate("")
        setEndDate("")
        setTitle("")
        setContent("")
    }

    return (
        <>
            <div style={{fontFamily: "Pretendard-Regular", height: '50rem'}} className="mt-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-center mt-8">
                    <p className="text-3xl">넥스트IT 마일스톤 캘린더</p>
                </div>
                <p className="border mt-6 ml-6 mr-6"></p>
                {studentOpen ? <Calendar
                    localizer={localizer}
                    className="truncate"
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: 600, margin: 40, backgroundColor: "#ffffff"}}
                    onSelectEvent={clickEvent}
                    selectable
                /> : <Calendar
                    localizer={localizer}
                    className="truncate"
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: 600, margin: 50, cursor: "pointer", backgroundColor: "#ffffff"}}
                    onSelectEvent={clickEvent}
                    onSelectSlot={clickSlot}
                    selectable
                />}

                {/*관리자만 뜸*/}
                <Modal isOpen={isModalOpen} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                    <ModalHeader>시작 일자</ModalHeader>
                    <input type="date" onChange={onChangeStartDate} name="startDate" value={startDate}
                           className="w-1/2 rounded-lg" style={{backgroundColor: "#f9fafb", cursor: "pointer"}}/><br/>
                    <ModalHeader>종료 일자</ModalHeader>
                    <input type="date" onChange={onChangeEndDate} name="endDate" value={endDate}
                           className="w-1/2 rounded-lg" style={{backgroundColor: "#f9fafb", cursor: "pointer"}}/>
                    <ModalHeader>일정 제목</ModalHeader>
                    <ModalBody className="mb-0">
                        <input type="text" onChange={onChangeTitle} name="title" value={title} placeholder="제목을 입력하세요."
                               className="rounded-lg w-1/2"
                               style={{backgroundColor: "#f9fafb"}}/>
                    </ModalBody>
                    <ModalHeader>일정 내용</ModalHeader>
                    <ModalBody>
                  <textarea type="text" onChange={onChangeContent} name="content" value={content}
                            placeholder="내용을 입력하세요." className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}/>
                    </ModalBody>
                    <ModalFooter>
                        <div className="block w-full flex flex-row justify-around">
                            <button
                                className="mr-2 align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-3 rounded-lg text-black bg-blue-200 border border-transparent active:bg-blue-400 hover:bg-blue-300 focus:shadow-outline-blue w-full"
                                block size="large" onClick={register}>
                                등록
                            </button>
                            <Button block size="large" layout="outline" onClick={closeModal}>
                                취소
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>

                {/*관리자 이벤트 클릭*/}
                <Modal isOpen={isModalTeacherEventOpen} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                    <ModalHeader>시작 일자</ModalHeader>
                    <input type="date" onChange={onChangeUpdateStartDate} name="startDate"
                           value={moment(updateStartDate).format("yyyy-MM-DD")} className="w-1/2 rounded-lg"
                           style={{backgroundColor: "#f9fafb", cursor: "pointer"}}/><br/>
                    <ModalHeader>종료 일자</ModalHeader>
                    <input type="date" onChange={onChangeUpdateEndDate} name="endDate"
                           value={moment(updateEndDate).format("yyyy-MM-DD")} className="w-1/2 rounded-lg"
                           style={{backgroundColor: "#f9fafb", cursor: "pointer"}}/>
                    <ModalHeader>일정 제목</ModalHeader>
                    <ModalBody className="mb-0">
                        <input type="text" onChange={onChangeUpdateTitle} name="title" value={updateTitle}
                               placeholder="제목을 입력하세요." className="rounded-lg truncate w-1/2"
                               style={{backgroundColor: "#f9fafb"}}/>
                    </ModalBody>
                    <ModalHeader>일정 내용</ModalHeader>
                    <ModalBody>
                  <textarea type="text" onChange={onChangeUpdateContent} name="content" value={updateContent}
                            placeholder="내용을 입력하세요." className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}/>
                    </ModalBody>
                    <ModalFooter>
                        <div className=" sm:block">
                            <button
                                className="mr-3 align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-black bg-purple-200 border border-transparent active:bg-purple-400 hover:bg-purple-300 focus:shadow-outline-purple"
                                onClick={updated}>수정
                            </button>
                            <button
                                className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-black bg-pink-200 border border-transparent active:bg-pink-400 hover:bg-pink-300 focus:shadow-outline-pink"
                                onClick={deleted}>삭제
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>

                {/*학생 이벤트 클릭*/}
                <Modal isOpen={isModalStudentEventOpen} onClose={closeModal} style={{fontFamily: "Pretendard-Regular"}}>
                    <ModalHeader>시작 일자</ModalHeader>
                    <input type="date" onChange={onChangeStartDate} name="startDate" disabled
                           value={moment(updateStartDate).format("yyyy-MM-DD")} className="w-1/2 rounded-lg"
                           style={{backgroundColor: "#f9fafb"}}/><br/>
                    <ModalHeader>종료 일자</ModalHeader>
                    <input type="date" onChange={onChangeEndDate} name="endDate" disabled
                           value={moment(updateEndDate).format("yyyy-MM-DD")} className="w-1/2 rounded-lg"
                           style={{backgroundColor: "#f9fafb"}}/>
                    <ModalHeader>일정 제목</ModalHeader>
                    <ModalBody className="mb-0">
                        <input type="text" onChange={onChangeTitle} disabled name="title" value={updateTitle}
                               className="rounded-lg truncate w-1/2"
                               style={{backgroundColor: "#f9fafb"}}/>
                    </ModalBody>
                    <ModalHeader>일정 내용</ModalHeader>
                    <ModalBody>
                  <textarea type="text" onChange={onChangeContent} disabled name="content" value={updateContent}
                            className="rounded-lg w-full"
                            style={{backgroundColor: "#f9fafb"}}/>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
}

export default CalendarEx;
