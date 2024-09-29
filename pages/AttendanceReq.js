import React, { useEffect, useState,useRef } from 'react';
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import _ from "lodash"

export default function AttendanceReq ({ userId, startDate, endDate, name, courseInfo, close }) {
  const [headCount, setHeadCount] = useState();
  const [result, setResult] = useState([]);
  const attendanceReq = useRef(null)

  useEffect(() => {
    if (userId && startDate && endDate) {
      fetchInfo();
      count();
    }
  }, [userId, startDate, endDate]);

  const fetchInfo = async () => {
    try {
      const res = await axios.get(`/viewAttendance?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
      setResult(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };
  const [groupedData, setGroupedData] = useState({})
  useEffect(()=>{
    console.log(result)
    if(result.length > 0){
      setGroupedData(groupByMonth(result))
    }
  },[result])


  useEffect(() => {
    if(!_.isEmpty(groupedData)){
      save()
      close()
    }
  }, [groupedData]);

  const count = async () => {
    try {
      const res = await axios.get(`/countSame?userId=${userId}`);
      setHeadCount(res.data);
    } catch (error) {
      console.error("countError", error);
    }
  };

  const save = async() => {
    const input = document.querySelector("#attendanceReq");
    if (!input) {
      console.error("Element with ID 'attendanceReq' not found");
      return;
    }
    const style = document.createElement('style');
    document.head.appendChild(style);
    // style.sheet?.insertRule('body > div:last-child PNG{ display: inline-block; }');
    if(startDate && endDate) {
      await html2canvas(input, {scale: 3}).then((canvas) => {
        style.remove();
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        const imgWidth = 295;
        const pageHeight = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${name}_출석부.pdf`);
      }).catch((error) => {
        console.error("Error generating PDF:", error);
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "출석":
        return "○";
      case "지각":
        return "◎";
      case "조퇴":
        return "▲";
      case "지각&조퇴":
        return "⊙";
      case "결석":
        return "×";
      case "외출":
        return "◇";
      case "지각&외출":
        return "▶";
      case "외출&조퇴":
        return "☆";
      case "지각&외출&조퇴":
        return "★";
      case "휴가":
        return "▦";
      default:
        return "";
    }
  };

  const groupByMonth = (data) => {
    return data.reduce((acc, cur) => {
      const month = cur.date.split('-')[1];
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(cur);
      return acc;
    }, {});
  };


  return (
      <div id="attendanceReq" className="bg-white rounded-lg shadow-md p-6 mt-20 w-full">
        <h2 className="text-xl font-bold mb-4 text-center">출석부</h2>
        <div className="flex flex-col">
          <div className="flex flex-row border-2 border-b-0">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">훈련기관명</div>
            <div className="pl-2">넥스트아이티교육센터학원 [훈련기관관리번호 : 201601094, (구) 5289300188000</div>
          </div>
          <div className="flex flex-row border-2 border-b-0">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">소재지</div>
            <div className="pl-2">[34856] 대전광역시 중구 계룡로 825 (용두동 희영빌딩) 2층 일부</div>
          </div>
          <div className="flex flex-row border-2 border-b-0">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">훈련기관유형</div>
            <div className="w-4/12 pl-2">학원</div>
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">관할관서</div>
            <div className="w-4/12 pl-2">대전고용센터(대전고용센터)</div>
          </div>
          <div className="flex flex-row border-2 border-b-0">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">훈련과정명</div>
            <div className="pl-2">{courseInfo?.cohort_names}</div>
          </div>
          <div className="flex flex-row border-2 border-b-0">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">NCS(코드)</div>
            <div className="w-4/12 pl-2">응용SW엔지니어링(20010202)</div>
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">인정유효기간</div>
            <div className="w-4/12 pl-2">2023-10-23 ~ 2024-10-22</div>
          </div>
          <div className="flex flex-row border-2 border-b-0">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">정원</div>
            <div className="w-4/12 pl-2">{headCount}명</div>
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">훈련기간 / 일수</div>
            <div className="w-4/12 pl-2">120시간 / 140일</div>
          </div>
          <div className="flex flex-row border-2">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">주훈련대상</div>
            <div className="w-4/12 pl-2">산업구조변화대응</div>
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">훈련기간 / 회차</div>
            <div className="w-4/12 pl-2">{courseInfo?.start_date} ~ {courseInfo?.end_date}</div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row border-2 border-b-0">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">성명</div>
            <div className="pl-2">{name}</div>
          </div>
          <div className="flex flex-row border-2">
            <div className="w-2/12 text-center bg-blue-400 font-bold border-r-2 h-10 flex justify-center">훈련기간</div>
            <div className="pl-2">{startDate} ~ {endDate}</div>
          </div>
        </div>
        <p className="mt-2 ml-2 text-blue-600 text-sm">※ 출석시간표 등록이 되지 않는 경우 혹은 훈련생이 등록되지 않은 경우 출석자료가 보이지 않습니다</p>
        <p className="mt-2 ml-2 text-blue-600 text-sm"> 화면상태 표시 설명 출석:[○] 지각:[◎] 조퇴:[▲] 지각&조퇴:[⊙] 결석:[×] 외출:[◇] 지각&외출 :[▶] 외출&조퇴:[☆] 지각&외출&조퇴:[★] 휴가:[▦]</p>

        {/* 월별로 데이터를 그룹화하여 출력 */}
        <div className="flex flex-row mt-4 w-full">
          {Object.keys(groupedData).map((month) => (
              <div key={month} className="mx-2 text-center border-2">
                <div className="font-bold text-lg mb-2 border-b-2 bg-blue-400 h-10 flex justify-center">{month}월</div>
                <div className="flex flex-wrap justify-center">
                  {groupedData[month].map((v, i) => (
                      <div key={i} className="mx-2">
                        <p className="border-b-2 h-10 flex justify-center">{v.date.split("-")[2]}</p>
                        <p className="h-10 flex justify-center">{getStatusIcon(v.status)}</p>
                      </div>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};
