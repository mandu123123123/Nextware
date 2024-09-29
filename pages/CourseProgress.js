import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ChartCard from "../components/Chart/ChartCard";

function CourseProgress() {
    const [cookie, setCookie] = useState([]);
    const [CourseList, setCourseList] = useState([]);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    const [attendanceDays, setAttendanceDays] = useState(0);
    console.log(CourseList)
    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        // console.log("====>",cookie)
        setCookie(cookie.userId || 'No cookie found');
        selectCourse(cookie.userId || null);
    }, []);


    const selectCourse = async (param) => {
        const res = await axios.get(`/courseProgress?userId=${param}`);
        console.log(res);
        setCourseList(res.data);

        const startDate = res.data[0].startDate;
        const endDate = res.data[0].endDate;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        // 주말을 제외하고 계산
        const holidayDeleteTotalDay = (startDate, endDate) => {
            let count = 0;
            // startDate부터 endDate까지의 일수를 계산
            for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                const dayOfWeek = currentDate.getDay();
                // 주말이 아닌 경우 일요일 0 토요일 6
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    count++;
                }
            }
            return count;
        };
        // 전체훈련일
        const totalDays = holidayDeleteTotalDay(start, end);
        // 오늘까지의 훈련일 계산
        const attendanceDays = holidayDeleteTotalDay(start, today);
        // 공휴일 뺸거
        const totalDaysDeleteHolidays = totalDays //공휴일 (개교기념일 근로자의날 포함)
        setTotalDays(totalDaysDeleteHolidays);
        const attendanceDaysDeleteHolidays = attendanceDays
        setAttendanceDays(attendanceDaysDeleteHolidays);

        // 진행률 계산
        const percentage = ((attendanceDaysDeleteHolidays / totalDaysDeleteHolidays) * 100).toFixed(1);
        setProgressPercentage(percentage);
    };

    const progressBarContainer = {
        backgroundColor: '#f3f3f3', // 배경 색상 (연한 회색)
        border: '1px solid #ddd', // 경계선 색상 (회색)
        borderRadius: '5px', // 모서리를 둥글게
        height: '30px', // 높이 설정
        width: '100%', // 너비를 부모 컨테이너에 맞춤
        margin: '5px 0' // 상하 여백 설정
    };
    const progressBar = {
        background: 'linear-gradient(45deg,#f9a8d4,#93c5fd)', // 진행률 바 색상 (초록색)
        height: '100%', // 컨테이너 높이에 맞춤
        width: '0', // 기본 너비 0% (진행률에 따라 동적으로 변경됨)
        borderRadius: '5px', // 모서리를 둥글게
        transition: 'width 0.3s ease' // 너비 변화 시 애니메이션 효과
    }


    return (
        <div>
            {CourseList.map((course, i) => (
                <ChartCard title={course.cohortsName} key={i}>
                    {/*<p className="mb-3">{course.cohortsName}</p>*/}
                    <p className="text-sm ml-1">{course.startDate} ~ {course.endDate}&nbsp;({attendanceDays}/{totalDays}일)</p>
                    <div style={progressBarContainer}>
                        <div className="flex items-center"
                             style={{...progressBar, width: `${progressPercentage}%`}}>&nbsp; {progressPercentage}%
                        </div>
                    </div>
                </ChartCard>


            ))}
            {/*<div style={progressBarContainer}>*/}
            {/*    <div style={progressBar}></div>*/}
            {/*</div>*/}
        </div>
    )
}

export default CourseProgress;