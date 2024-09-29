import React, {useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import Modal from 'react-modal';
import { Input, Label, Button } from '@windmill/react-ui';
import axios from "axios";
import DaumPostcodeEmbed from "react-daum-postcode";
import '../assets/css/genderRadio.css';

function CreateAccount() {
  const router = useHistory();
  const location = useLocation();
  const auth = location.state?.code || {};
  const [isOpen, setIsOpen] = useState(false);
  const [cohorts, setCohorts] = useState([]);
  const [userInfo, setUserInfo] = useState({
    userId: '',
    authorityId: auth,
    userPw: '',
    confirmPw: '',
    email: '',
    name: '',
    gender: '',
    birth: '',
    address: '',
    address1: '',
    address2: '',
    phone: '',
    cohortsId: '',
    // startDate: '',
    // endDate: '',
  });
  const [errors, setErrors] = useState({});

  const formatPhoneNumber = (value) => {
    // 숫자만 남기기
    const phoneNumber = value.replace(/[^\d]/g, '');

    // 정규식을 사용해 하이픈 추가
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 필드의 경우 하이픈 자동 추가
    if (name === "phone") {
      const formattedPhone = formatPhoneNumber(value);
      setUserInfo({ ...userInfo, [name]: formattedPhone });
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
    setErrors({ ...errors, [name]: '' }); // 입력 시 오류 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 필드 유효성 검사
    if (!userInfo.userId) newErrors.userId = '아이디를 입력해 주세요.';
    if (!userInfo.userPw) newErrors.userPw = '비밀번호를 입력해 주세요.';
    if (!userInfo.confirmPw) newErrors.confirmPw = '비밀번호 확인을 입력해 주세요.';
    if (!userInfo.email) newErrors.email = '이메일을 입력해 주세요.';
    if (!userInfo.name) newErrors.name = '이름을 입력해 주세요.';
    if (!userInfo.birth) newErrors.birth = '생년월일 입력해 주세요.';
    if (!userInfo.address1) newErrors.address = '주소를 입력해 주세요.';
    if (!userInfo.phone) newErrors.phone = '전화번호를 입력해 주세요.';
    if (userInfo.userPw !== userInfo.confirmPw) newErrors.confirmPw = '비밀번호가 일치하지 않습니다.';
    if (userInfo.authorityId === "A003" && userInfo.cohortsId === "") newErrors.cohortsId = '해당하는 과정을 선택하주세요.'

    const res = await axios.post("/findById", {userid: userInfo.userId});
    if(res.data){
      newErrors.userId = '이미 존재하는 아이디입니다.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // 오류 메시지 설정
    } else {
      setErrors({});
      goRegister();
    }
  };

  const defaultProfileImages = async () => {
    await axios.post("/insertProfileImage", { createId: userInfo.userId });
  }

  const goRegister = async () => {
    const res = await axios.post("/register", {
      userId: userInfo.userId,
      authorityId: userInfo.authorityId,
      userPw: userInfo.userPw,
      confirmPw: userInfo.confirmPw,
      email: userInfo.email,
      name: userInfo.name,
      gender: userInfo.gender,
      birth: userInfo.birth,
      address: userInfo.address1 + ', ' + userInfo.address2,
      phone: userInfo.phone
    });

    await defaultProfileImages();

    if(userInfo.authorityId === "A003"){
      addStudent();
    }

    if(userInfo.authorityId === "A002"){
      addTeacher();
    }


    if(res.data === "success"){
      alert("가입 신청 완료");
      router.push("/login");
    } else {
      alert("가입 실패");
    }
  };



  const addStudent = async () =>{
    await axios.post("/addStudent", {studentId: userInfo.userId, cohortsId: userInfo.cohortsId, startDate:cohorts.startDate, endDate:cohorts.endDate});
  }
  const addTeacher = async () =>{
    await axios.post("/addTeacher", {teacherId: userInfo.userId});
  }

  const onCompletePost = (data) =>{
    setIsOpen(false);
    setUserInfo({ ...userInfo, address1: data.address });
  }

  useEffect(() => {
    const selectCohorts= async () => {
      const res = await axios.get("/selectCohorts");
      console.log(res.data)
      setCohorts(res.data);
    }
    selectCohorts();
  }, []);

  return (
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900" style={{fontFamily: "Pretendard-Regular"}}>
        <div className="flex-1 h-full max-w-md  mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-full">
              <div className="w-full">
                {isOpen &&
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        style={{
                          content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            width: '500px',
                            height: '500px',
                          },
                        }}>
                      <DaumPostcodeEmbed setIsOpen={isOpen} onComplete={onCompletePost}/>
                    </Modal>
                }

                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Create account
                </h1>
                <Label>
                  <span>ID</span>
                  <Input className="mt-1" type="text" placeholder="아이디를 입력해주세요." name="userId" id="userId" value={userInfo.userId} onChange={handleChange} />
                  {errors.userId && <span style={{ color: 'red' }}>{errors.userId}</span>}
                </Label>
                <Label className="mt-2">
                  <span>Password</span>
                  <Input className="mt-1" placeholder="***************" type="password" name="userPw" id="userPw" value={userInfo.userPw} onChange={handleChange} />
                  {errors.userPw && <span style={{ color: 'red' }}>{errors.userPw}</span>}
                </Label>
                <Label className="mt-2">
                  <span>Confirm password</span>
                  <Input className="mt-1" placeholder="***************" type="password" name="confirmPw" id="confirmPw" value={userInfo.confirmPw} onChange={handleChange} />
                  {errors.confirmPw && <span style={{ color: 'red' }}>{errors.confirmPw}</span>}
                </Label>
                <Label className="mt-2">
                  <span>Email</span>
                  <Input className="mt-1" type="email" placeholder="example@example.com" name="email" id="email" value={userInfo.email} onChange={handleChange} />
                  {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                </Label>
                <Label className="mt-2">
                  <span>이름</span>
                  <Input className="mt-1" type="text" name="name" id="name" value={userInfo.name} onChange={handleChange} />
                  {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                </Label>
                <Label className="mt-2">
                  <span>성별</span>
                  <div>
                    <label>
                      <input className="text-purple-400 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-graydark:border-gray-600 dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 mt-1" type="radio" name="gender" id="gender" value="M" onChange={handleChange} checked/> 남자{' '}
                    </label>
                    <label>
                      <input className="text-purple-400 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-graydark:border-gray-600 dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 mt-1" type="radio" name="gender" id="gender" value="W" onChange={handleChange}/> 여자
                    </label>
                  </div>
                </Label>
                <Label className="mt-2">
                  <span>생년월일</span>
                  <Input className="mt-1" type="date" name="birth" id="birth" value={userInfo.birth} onChange={handleChange} />
                  {errors.birth && <span style={{ color: 'red' }}>{errors.birth}</span>}
                </Label>
                <Label className="mt-2">
                  <span>주소</span>
                  <div className="flex gap-2">
                    <Input className="mt-1 w-3/4" type="text" name="address1" id="address1" value={userInfo.address1} onChange={handleChange} readOnly/>
                    <button onClick={()=>{setIsOpen(true)}} className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-purple-400 border border-transparent hover:bg-purple-500 focus:shadow-outline-purple w-1/4 mt-1">찾기</button>
                  </div>
                  <Input className="mt-1" type="text" name="address2" id="address2" value={userInfo.address2} onChange={handleChange} placeholder="상세주소"/>
                  {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
                </Label>
                <Label className="mt-2">
                  <span>전화번호</span>
                  <Input className="mt-1" type="tel" name="phone" id="phone" value={userInfo.phone} onChange={handleChange} maxLength={13}/>
                  {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
                </Label>
                {auth === "A003" && (
                    <Label className="mt-2">
                      <span>해당 과정</span>
                      <select className="block w-full p-2 rounded-md border-gray-200" name="cohortsId" id="cohortsId" onChange={handleChange} >
                        <option value="" selected>해당하는 과정을 선택해주세요.</option>
                        {cohorts.map((cohort,index) => <option key={index} value={cohort.cohortsId}>{cohort.cohortsName}</option>)}
                      </select>
                      {errors.cohortsId && <span style={{ color: 'red' }}>{errors.cohortsId}</span>}
                    </Label>)}

                <button onClick={handleSubmit} block className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-purple-400 border border-transparent hover:bg-purple-500 focus:shadow-outline-purple w-full mt-4">
                  Create account
                </button>

                <hr className="my-6"/>

                <p className="mt-2 text-sm font-medium">
                  Already have an account?
                  <Link
                      className="ml-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      to="/login"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
  )
}

export default CreateAccount
