import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import axios from "axios";
import RoundIcon from "../components/RoundIcon";
import { MoneyIcon, PeopleIcon } from "../icons";
import {aliasToReal} from "lodash/fp/_mapping";

const AttendanceCheck = () => {
  const [userId, setUserId] = useState('');
  const [isInClicked, setIsInClicked] = useState(false);
  const [isOutClicked, setIsOutClicked] = useState(false);
  const [todayArrive, setTodayArrive] = useState();
  const [todayLeave, setTodayLeave] = useState();

  useEffect(() => {
    const cookie = JSON.parse(Cookies.get('userid'));
    setUserId(cookie.userId || 'No cookie found');

    // 자정 이후 로컬 스토리지 초기화 확인
    const now = new Date();
    const lastResetDate = new Date(localStorage.getItem('lastResetDate'));

    if (now.toDateString() !== lastResetDate.toDateString()) {
      // 날짜가 변경되었으면 로컬 스토리지 초기화
      localStorage.setItem('ArriveState', JSON.stringify({ [userId]: false }));
      localStorage.setItem('LeaveState', JSON.stringify({ [userId]: false }));
      localStorage.setItem('lastResetDate', now.toISOString());
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchToday();
      const arriveState = JSON.parse(localStorage.getItem("ArriveState")) || {};
      const leaveState = JSON.parse(localStorage.getItem("LeaveState")) || {};

      setIsInClicked(arriveState[userId] === true);
      setIsOutClicked(leaveState[userId] === true);
    }
  }, [userId]);

  const fetchToday = async () => {
    try {
      const res = await axios.get(`/todayCommute?userId=${userId}`);
      console.log(">>", res.data);
      setTodayArrive(res.data.arriveTime?.replace("T", " "));
      setTodayLeave(res.data.leaveTime?.replace("T", " "));
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  const arrive = async () => {
    setIsInClicked(true);
    const arriveState = JSON.parse(localStorage.getItem("ArriveState")) || {};
    arriveState[userId] = true;
    localStorage.setItem("ArriveState", JSON.stringify(arriveState));

    let today = new Date();
    today.setHours(today.getHours() + 9);
    const arriveTime = today.toISOString().replace('T', ' ').substring(0, 19);

    try {
      const res = await axios.post(`/arrive?arriveTime=${arriveTime}`, { userId: userId });
      if (res.data > 0) {
        fetchToday(); // 재조회
      }
    } catch (error) {
      console.error("fetch Error", error);
    }
  };

  const leave = async () => {
    if(!isInClicked){
      alert("입실을 누르지 않았습니다")
      return;
    }
    setIsOutClicked(true);
    const leaveState = JSON.parse(localStorage.getItem("LeaveState")) || {};
    leaveState[userId] = true;
    localStorage.setItem("LeaveState", JSON.stringify(leaveState));

    let today = new Date();
    today.setHours(today.getHours() + 9);
    const leaveTime = today.toISOString().replace('T', ' ').substring(0, 19);

    try {
      const res = await axios.post(`/leave?leaveTime=${leaveTime}&arriveTime=${todayArrive}`, { userId: userId });
      if (res.data > 0) {
        fetchToday(); // 재조회
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
      <>
        <div className={`min-w-0 rounded-lg shadow-xs overflow-hidden group cursor-pointer ${isInClicked ? "bg-red-300" : "bg-white hover:bg-red-300"}`} style={{ pointerEvents: isInClicked ? "none" : "auto" }}>
          <div className="p-4 flex items-center" onClick={arrive}>
            <RoundIcon
                icon={PeopleIcon}
                iconColorClass="text-red-500"
                bgColorClass="bg-red-100"
                className="mr-4"
            />
            <div>
              <p className={`mb-2 text-sm font-medium text-gray-600 ${isInClicked ? "text-white" : "text-gray-600 group-hover:gray-100"}`}>
                {isInClicked ? todayArrive : ""}
              </p>
              <p className={`text-lg text-gray-700 ${isInClicked ? "text-white" : "text-gray-700 group-hover:gray-200"}`}>
                {isInClicked ? "입실 완료" : "입실"}
              </p>
            </div>
          </div>
        </div>

        <div className={`min-w-0 rounded-lg shadow-xs overflow-hidden group cursor-pointer ${isOutClicked ? "bg-blue-200" : "bg-white hover:bg-blue-200"}`} style={{ pointerEvents: isOutClicked ? "none" : "auto" }}>
          <div className="p-4 flex items-center" onClick={leave}>
            <RoundIcon
                icon={MoneyIcon}
                iconColorClass="text-blue-500"
                bgColorClass="bg-blue-100"
                className="mr-4"
            />
            <div>
              <p className={`mb-2 text-sm font-medium text-gray-600 ${isOutClicked ? "text-white" : "text-gray-600 group-hover:gray-100"}`}>
                {isOutClicked ? todayLeave : ""}
              </p>
              <p className={`text-lg text-gray-700 ${isOutClicked ? "text-white" : "text-gray-700 group-hover:gray-200"}`}>
                {isOutClicked ? "퇴실 완료" : "퇴실"}
              </p>
            </div>
          </div>
        </div>
      </>
  );
};

export default AttendanceCheck;
