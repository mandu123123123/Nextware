import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Modal} from "@windmill/react-ui";
import Evaluation from "./Evaluation";

function Lecture() {
  const location = useLocation();
  const [hwList, setHwList] = useState([]);  // 초기값을 빈 배열로 설정
  const history = useHistory();

  const {lectureName, lectureNo, userAuth, cohortsId} = location.state || {};
  const [userId, setUserId] = useState(null);
  const [evOpen, setEvOpen] = useState(false);
  const [evaluation, setEvaluation] = useState(false);

  useEffect(() => {
    const cookie = JSON.parse(Cookies.get('userinfo'));
    setUserId(cookie.userId || 'No cookie found')
  }, []);

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const res = await axios.post("/selectHomeworks", { lectureNo, cohortsId });
        setHwList(res.data || []);  // 데이터를 상태로 설정, null인 경우 빈 배열로 초기화
      } catch (error) {
        console.error("Error fetching homeworks:", error);
        setHwList([]);  // 에러 발생 시 빈 배열로 설정
      }
    };

    fetchHomeworks();
  }, [lectureNo, cohortsId]);  // lectureNo와 cohortsId가 변경될 때마다 호출

  const goNewHomework = () => {
    history.push('/app/newHomework', {lectureNo: lectureNo, cohortsId: cohortsId});
  }

  const closeEv = () => {
    setEvOpen(false);
  }

  // 강의평가 제출 여부 판단
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await axios.post("/checkEvaluationSubmit", {lectureNo, userId});
        console.log(res.data);
        if (res.data === "exist") {
          setEvaluation(false);
        } else if (res.data === null) {
          setEvaluation(true);
        }
      } catch (error) {
        console.error("Error checking evaluation:", error);
      }
    }
    if (userId) {
      fetchEvaluation();
    }
  }, [userId, lectureNo, evOpen]);

  return (
      <div className="bg-white shadow-md rounded-lg mt-6 p-6" style={{fontFamily: "Pretendard-Regular", height: '52rem'}}>
        <Modal
            isOpen={evOpen}
            onClose={closeEv}
            className="w-1/2"
        >
          <Evaluation setEvOpen={setEvOpen} lectureNo={lectureNo} cohortsId={cohortsId} studentId={userId}/>
        </Modal>

        <div className="flex justify-center">
          <p className="text-3xl">{lectureName}</p>
        </div>
        <p className="border mt-6 mb-6"></p>

        {/*<div className="flex w-full bg-white rounded-lg mb-6 h-32 items-end p-4 mt-6 border">*/}
        {/*  <p className="text-3xl">{lectureName}</p>*/}
        {/*</div>*/}

        {/*<div className="w-1/6 bg-white rounded-lg h-32 border flex flex-row justify-center">*/}
        <div className="flex items-center justify-between mb-4">
          <button className="border-pink-200 bg-pink-200 hover:bg-pink-400 text-white mb-2 text-base rounded-lg cursor-pointer px-4 py-1 font-thin h-12" onClick={history.goBack}>뒤로가기</button>
          {
            userAuth === "A002"
                ? <button onClick={goNewHomework}
                          className="bg-blue-300 hover:bg-blue-400 text-white mb-2 text-base rounded-lg px-4 py-1 font-thin h-12">과제
                  등록</button>
                : evaluation ? (<button onClick={() => setEvOpen(true)}
                                        className="bg-blue-300 hover:bg-blue-400 mb-2 text-white text-base rounded-lg px-4 py-1 font-thin h-10">
                  강의평가
                </button>) : (<p className="text-blue-500 mr-2">강의평가 완료</p>)
          }
        </div>
        {/*</div>*/}
        <div className="flex gap-4 overflow-y-scroll" style={{height: '39rem'}}>
          {/*<div className="w-1/6 bg-white rounded-lg h-32 border flex flex-row justify-center">*/}
          {/*  {*/}
          {/*    userAuth === "A002"*/}
          {/*        ? <button onClick={goNewHomework}*/}
          {/*                  className="bg-green-400 text-white text-base rounded-lg px-4 py-2 font-thin h-12">과제 등록</button>*/}
          {/*        : evaluation ? (<button onClick={() => setEvOpen(true)} className="bg-green-400 text-white text-base rounded-lg px-4 py-2 font-thin h-10">*/}
          {/*          강의평가*/}
          {/*        </button>) : (<p>강의평가 완료</p>)*/}
          {/*  }*/}
          {/*</div>*/}
          <div className="w-full rounded-lg">
            {
              hwList.length > 0 ? hwList.map((hw, index) => {
                return (
                    <div key={index} className="bg-white w-full rounded-lg mb-6 border border-dashed hover:bg-gray-50 shadow-md">
                      <Link to={{
                        pathname: `/app/hwDetail/${hw.hwNo}`,
                        state: {hwNo: hw.hwNo},
                      }}>
                        <div className="flex flex-row justify-between p-4">
                          <p>{hw.title}</p>
                          <p>{new Date(hw.createDate).toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}</p>
                        </div>
                      </Link>
                    </div>
                )
              }) : <div className="bg-white w-full shadow-md rounded-lg mb-4 border border-dashed p-4">등록된 과제가 없습니다.</div>
            }
          </div>
        </div>
      </div>
  );
}

export default Lecture;
