import React, { useState } from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'

import ImageLight from '../assets/img/forgot-password-office.jpeg'
import ImageDark from '../assets/img/forgot-password-office-dark.jpeg'
import { Label, Input, Button } from '@windmill/react-ui'
import axios from "axios";
import {router} from "express/lib/application";

function ChangePassword() {
  const [changePw, setChangePw] = useState('');
  const [changeConfirmPw, setChangeConfirmPw] = useState('');
  const location = useLocation();
  const history = useHistory();

  const userId = location.state?.userId || 'No data';

  const onChangePw = async () => {
    if(changePw === changeConfirmPw) {
      //여기서 비밀번호 변경 axios
      const res = await axios.post("/change-password", {password: changePw, userId: userId});
      if(res.data === "success"){
        alert("변경 성공! 로그인 해주세요.");
        history.push('/login');
      }
    } else {
      alert("입력한 비밀번호가 일치하지 않습니다.");
    }
  }
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <main className="flex flex-col items-center justify-center p-6 sm:p-12 md:w-full">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                비밀번호 변경
              </h1>

              <Label>
                <span>변경할 비밀번호</span>
                <Input type="password" className="mt-1" value={changePw} onChange={(e) => setChangePw(e.target.value)} />
              </Label>

              <Label>
                <span>변경할 비밀번호 확인</span>
                <Input type="password" className="mt-1" value={changeConfirmPw} onChange={(e) => setChangeConfirmPw(e.target.value)} />
              </Label>

              <Button onClick={onChangePw} block className="mt-4">
                Change Password
              </Button>
            </div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
