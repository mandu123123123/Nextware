import React, {useState, useEffect} from "react";
import PageTitle from "../components/Typography/PageTitle";
import Todo from "../components/Todo/Todo";
import Weather from './Weather';
import CourseProgress from "./CourseProgress";
import Leave from "./Leave";
import AttendanceCheck from "./AttendanceCheck";
import Cookies from 'js-cookie';
import axios from "axios";
import {useHistory} from "react-router-dom";

function Dashboard() {
    const [cookie, setCookie] = useState("");
    const router = useHistory();
    const [courseAuth, setCourseAuth] = useState(null);

    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setCookie(cookie.userId || 'No cookie found');
        selectCourseAuthority(cookie.userId || null);
    }, []);

    // 과정권환
    const selectCourseAuthority = async (param) => {
        const res = await axios.get(`/courseAuthority?userId=${param}`);
        // console.log("=>", res);
        setCourseAuth(res.data)
    }

    return (
        <div className="grid gap-6 mb-8 md:grid-cols-2 mt-8" style={{fontFamily: "Pretendard-Regular"}}>
            {/* 왼쪽 div */}
            <div className="space-y-6">
                <div className="bg-white p-4 border rounded-md">
                    {/*<PageTitle>출입 관리</PageTitle>*/}
                    <div className="grid gap-6 md:grid-cols-2">
                        <AttendanceCheck />
                    </div>
                </div>

                {courseAuth && (
                    courseAuth[0]?.authorityId === "A003" ?
                        <div className="bg-white border p-4 rounded-md">
                            {/*<PageTitle>과정진행률</PageTitle>*/}
                            <div className="grid gap-6 md:grid-cols-1">
                                <CourseProgress/>
                            </div>
                        </div> : (courseAuth[0]?.authorityId === "A002" ?
                            <div className="bg-white border p-4 rounded-md">
                                <PageTitle>{"<"}{courseAuth[0]?.name}>님의 휴가 현황</PageTitle>
                                <div className="grid gap-6 md:grid-cols-1">
                                    <Leave/>
                                </div>
                            </div>
                            : (courseAuth[0]?.authorityId === "A001" ?
                                <div className="bg-white border p-4 rounded-md">
                                    <PageTitle>승인 페이지 작성</PageTitle>
                                    <div className="grid gap-6 md:grid-cols-1">
                                        <div className="flex flex-row justify-between">
                                            <button
                                                className="bg-blue-100 p-2 rounded-md border flex items-center justify-center w-1/2"
                                                onClick={()=>{router.push("/app/approveLeave")}}
                                            >
                                                <div className="font-bold text-lg">휴가승인</div>
                                            </button>
                                        </div>
                                    </div>
                                </div> : ''))
                )}

                <div className="bg-white border p-4 rounded-md" style={{height: '25rem'}}>
                    {/*<PageTitle>날씨</PageTitle>*/}
                    <Weather/>
                </div>
            </div>

            {/* 오른쪽 div */}
            <div className="bg-white p-4 border rounded-md" style={{maxHeight:"48rem"}}>
                <PageTitle>To Do List</PageTitle>
                <Todo/>
            </div>
        </div>
    );
};

export default Dashboard;
