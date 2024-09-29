import React, {useState} from 'react'
import { Link, useHistory } from 'react-router-dom'

import ImageLight from '../assets/img/login-office.jpeg'
import ImageDark from '../assets/img/login-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Label, Input, Button } from '@windmill/react-ui'
import axios from "axios";
import {go} from "tailwindcss/lib/cli/emoji";

function Login() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [msg, setMsg] = useState("");

  const router = useHistory();

  const goLogin = async () =>{
    if(!userId){
      alert("아이디를 입력해주세요.");
      return;
    }
    if(!userPw){
      alert("비밀번호를 입력해주세요.");
      return;
    }
    const res = await axios.post("/login",{userId: userId, userPw: userPw},{ withCredentials: true });
    if(res.data === "success"){
        router.push('/app');
    } else if(res.data === "not"){
      alert("승인 대기중 입니다.");
    } else if(res.data === "fail"){
      alert("아이디 또는 비밀번호가 일치하지 않습니다.")
    }
  }

  const enterKey = (e) =>{
    if (e.key === 'Enter') {
      e.preventDefault();
      goLogin();
    }
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900" style={{fontFamily: "Pretendard-Regular"}}>
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <main className="flex flex-col items-center justify-center p-6 sm:p-12 md:w-full sm:flex-row">
            <div className="w-1/2 flex flex-row items-center justify-center sm:pr-6">
              <img src="/mainLogo.png" style={{ width: '100%' }} />
            </div>
            <div className="w-full sm:pl-6 sm:w-1/2">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <Label>
                <span>ID</span>
                <Input className="mt-1" type="test" placeholder="User ID" value={userId} onChange={(e)=> {setUserId(e.target.value)}} />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input className="mt-1" type="password" placeholder="********" value={userPw} onChange={(e)=> {setUserPw(e.target.value)}} onKeyDown={enterKey}/>
              </Label>

              <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-purple-400 border border-transparent hover:bg-purple-500 focus:shadow-outline-purple w-full mt-4 block" onClick={goLogin}>
                로그인
              </button>

              <hr className="my-8"/>

              <p className="mt-4">
                <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
              <p className="mt-4">
                <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/select-auth"
                >
                  Create account
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
