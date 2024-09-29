import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'

import ImageLight from '../assets/img/forgot-password-office.jpeg'
import ImageDark from '../assets/img/forgot-password-office-dark.jpeg'
import { Label, Input, Button } from '@windmill/react-ui'
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);
  const [passKey, setPassKey] = useState("");
  const [changeId, setChangeId] = useState("");

  const router = useHistory();

  const checkEmail = async () =>{
    const res = await axios.post("/check-email", {email: email});
    if(res.data === "success"){
      await sendEmail();
    } else {
      alert("일치하는 이메일이 없습니다.");
    }
  }

  const sendEmail = async () =>{
    alert("메일 발송 완료.\n메일이 오지 않았다면 다시 시도해주세요.");
    setShow(true);
    const res = await axios.post("/send/mail",{email: email});
    if(res.data.status === "success"){
      setPassKey(res.data.code);
      setChangeId(res.data.userId)
    }
  }

  const checkCode = () => {
    if(code === passKey){
      alert("인증 되었습니다");
      router.push('/change-password',{userId: changeId});
    } else {
      alert("인증번호가 일치하지 않습니다.")
    }
  }
  
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900" style={{fontFamily: "Pretendard-Regular"}}>
      <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/*<div className="h-32 md:h-auto md:w-1/2">*/}
          {/*</div>*/}
          <main className="flex flex-col items-center justify-center p-6 sm:p-12 md:w-full">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                비밀번호 변경
              </h1>

              <Label>
                <span>Email</span>
                <Input className="mt-1" placeholder="test@example.com" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Label>

              {/*<Button tag={Link} to="/login" block className="mt-4">*/}
              {/*  Recover password*/}
              {/*</Button> */}
              <button onClick={checkEmail} block className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-purple-400 border border-transparent hover:bg-purple-500 focus:shadow-outline-purple w-full mt-4">
                Recover password
              </button>
            </div>
            {show ? (
                <div className="w-full mt-4">
                  <Label>
                    <span>인증번호 입력</span>
                    <Input className="mt-1" name="text" value={code}
                           onChange={(e) => setCode(e.target.value)}/>
                  </Label>

                  <button onClick={checkCode} block className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-purple-400 border border-transparent hover:bg-purple-500 focus:shadow-outline-purple w-full mt-4">
                    확인
                  </button>
                </div>) : null}

          </main>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
