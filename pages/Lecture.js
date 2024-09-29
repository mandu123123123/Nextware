import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Link} from "react-router-dom";

function Lecture() {
  const [lecList, setLecList] = useState([]);
  const [userAuth, setUserAuth] = useState(null);

  useEffect(() => {
    const info = Cookies.get("userinfo");

    const selectLecture = async (id) => {
      const res = await axios.post("/selectLecture", { userId: id });
      setLecList(res.data);
      console.log(res.data);
    };

    const selectTeacherLecture = async (id) => {
      const res = await axios.post("/selectTeacherLecture", { userId: id });
      setLecList(res.data);
      console.log("t ===>", res.data);
    }

    const fetchData = async () => {
      if (info) {
        const userinfo = JSON.parse(info);
        // setUserId(userinfo.userId);
        setUserAuth(userinfo.authorityId);
        if (userinfo.authorityId === "A003") {
          await selectLecture(userinfo.userId);
        }
        if (userinfo.authorityId === "A002"){
          await selectTeacherLecture(userinfo.userId);
        }
      }
    };

    fetchData(); // 비동기 함수 호출
  }, []);

  return (
      <div className="bg-white rounded-lg shadow-md mt-6" style={{height:"50rem"}}>
        <div className="flex justify-center mt-10" style={{fontFamily: "Pretendard-Regular"}}>
          <p className="text-3xl">강의</p>
        </div>
        <p className="border mt-6 mb-3 mr-6 ml-6"></p>
        <div className="grid grid-cols-4 gap-10 place-items-center mx-8" style={{fontFamily: "Pretendard-Regular"}}>
          {
            lecList.map((lec) => {
              return (
                  <Link key={lec.lectureNo} to={{
                    pathname: "/app/hwList",
                    state: {
                      lectureName: lec.lectureName,
                      lectureNo: lec.lectureNo,
                      userAuth: userAuth,
                      cohortsId: lec.cohortsId
                    },
                  }}>
                    <div
                        className="flex flex-col delay-100 duration-300 border border-dashed max-w-md p-4 bg-white dark:text-gray-800 mt-10 rounded-lg shadow-lg transition-transform transform hover:scale-105 h-64 overflow-hidden hover:bg-gray-50">
                      <div className="flex-grow">
                        <h2 className="text-xl font-semibold">{lec.lectureName}</h2>
                        <p className="block pb-2 text-sm dark:text-gray-600 mt-3">
                          {/*<p>과정명 :</p>*/}
                          {lec.cohortsName}
                        </p>
                      </div>
                      <div className="border-t mt-2 pt-3">
                        {
                            userAuth === "A003" && lec.teacherName
                        }
                        {
                            userAuth === "A002" && `🗓️ ${lec.startDate} ~ ${lec.endDate}`
                        }
                      </div>
                    </div>
                  </Link>
              )
            })
          }
        </div>
      </div>
  );
}

export default Lecture;
