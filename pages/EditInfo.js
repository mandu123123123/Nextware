import React, { useEffect, useState } from 'react';
import { Input, Label, Button } from '@windmill/react-ui';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import DaumPostcodeEmbed from 'react-daum-postcode';
import {useHistory} from "react-router-dom";

// import {router} from "express/lib/application";

function EditInfo({userId,close}) {
  const router = useHistory();
  // const [userId, setUserId] = useState('');
  const [info, setInfo] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const cookie = JSON.parse(Cookies.get('userid'));
  //   setUserId(cookie.userId || 'No cookie found');
  // }, []);

  useEffect(() => {
    if (userId) {
      fetchInfo();
    }
  }, [userId]);

  useEffect(() => {
    console.log(">>", info);
  }, [info]);

  const fetchInfo = async () => {
    try {
      const response = await axios.get(`/info/${userId}`);
      console.log("??",response.data)
      const addressParts = response.data[0].address ? response.data[0].address.split(",") : ["", ""];
      console.log("???<",addressParts)
      setInfo({ ...response.data[0], address: addressParts[0], address2: addressParts[1] });
    } catch (error) {
      console.error('Error fetching Info:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const updateBtn = async () => {
    try {
      const fullAddress = `${info.address},${info.address2}`;
      await axios.post(`/info/${userId}`, { ...info, address: fullAddress });
      alert('정보가 성공적으로 업데이트되었습니다.');
      // fetchInfo();
      close()
      // router.push('/app/mypage')
    } catch (error) {
      console.error('Error updating Info:', error);
    }
  };

  const onCompletePost = (data) => {
    setIsOpen(false);
    setInfo({ ...info, address: data.address });
  };

  const [postOpen, setPostOpen] = useState(false);

  return (
      <div className="flex items-center dark:bg-gray-900">
        <div className="flex-1 max-w-full overflow-hidden bg-white rounded-lg dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <main className="flex items-center justify-center sm:p-12 md:w-full">
              <div className="w-full">
                {isOpen && (
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        onClose={() => setIsOpen(false)}
                        style={{
                          content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            width: '400px',
                            height: '600px',
                          },
                        }}
                    >
                      <DaumPostcodeEmbed onComplete={onCompletePost}/>
                    </Modal>
                )}
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  정보 수정
                </h1>
                <Label>
                  <span>ID</span>
                  <Input
                      className="mt-1"
                      type="text"
                      name="userId"
                      value={info.userId || ''}
                      readOnly
                  />
                </Label>
                <Label className="mt-2">
                  <span>Password</span>
                  <Input
                      className="mt-1"
                      placeholder="***************"
                      type="password"
                      name="userPw"
                      onChange={handleChange}
                      value={info.userPw || ''}
                  />
                </Label>
                <Label className="mt-2">
                  <span>Email</span>
                  <Input
                      className="mt-1"
                      type="email"
                      name="email"
                      value={info.email || ''}
                      onChange={handleChange}
                  />
                </Label>
                <Label className="mt-2">
                  <span>이름</span>
                  <Input
                      className="mt-1"
                      type="text"
                      name="name"
                      value={info.name || ''}
                      onChange={handleChange}
                  />
                </Label>
                <Label className="mt-2">
                  <span>성별</span>
                  <div>
                    <label>
                      <input
                          className="text-pink-400 form-radio focus:outline-none focus:border-pink-300 dark:border-gray-600 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 mt-1 cursor-pointer"
                          type="radio"
                          name="gender"
                          value="M"
                          onChange={handleChange}
                          checked={info.gender === 'M'}
                      />{' '}
                      남자{' '}
                    </label>
                    <label>
                      <input
                          className="text-pink-400 form-radio focus:outline-none focus:border-pink-300 dark:border-gray-600 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700 mt-1 cursor-pointer"
                          type="radio"
                          name="gender"
                          value="W"
                          onChange={handleChange}
                          checked={info.gender === 'W'}
                      />{' '}
                      여자
                    </label>
                  </div>
                </Label>
                <Label className="mt-2">
                  <span>생년월일</span>
                  <Input
                      className="mt-1 cursor-pointer"
                      type="date"
                      name="birth"
                      value={info.birth || ''}
                      onChange={handleChange}
                  />
                </Label>
                <Label className="mt-2">
                  <span>주소</span>
                  <div className="flex gap-2">
                    <Input
                        className="mt-1 w-3/4"
                        type="text"
                        name="address"
                        value={info.address || ''}
                        onChange={handleChange}
                    />
                    <button onClick={() => setIsOpen(true)} className="w-1/4 mt-1 align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white border border-transparent active:bg-pink-500 hover:bg-pink-400 focus:shadow-outline-purple bg-pink-300">
                      찾기
                    </button>
                  </div>
                  <Input
                      className="mt-1"
                      type="text"
                      name="address2"
                      value={info.address2 || ''}
                      onChange={handleChange}
                      placeholder="상세주소"
                  />
                </Label>
                <Label className="mt-2">
                  <span>전화번호</span>
                  <Input
                      className="mt-1"
                      type="tel"
                      name="phone"
                      value={info.phone || ''}
                      onChange={handleChange}
                  />
                </Label>
                <div className="flex mt-3 justify-evenly">
                  <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white border border-transparent active:bg-pink-500 hover:bg-pink-400 focus:shadow-outline-purple w-5/12 bg-pink-300" onClick={updateBtn}>
                    저장
                  </button>
                  <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-gray-300 border border-transparent active:bg-gray-500 hover:bg-gray-400 focus:shadow-outline-purple w-5/12" onClick={close}>취소</button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
  );
}

export default EditInfo;