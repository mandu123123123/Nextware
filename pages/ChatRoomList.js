import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


function ChatRoomList({ onSelectRoom, refreshList  }) {
    const [chatRooms, setChatRooms] = useState([]);
    const [cohortsInfo, setCohortsInfo] = useState([]);
    const [cookie, setCookie] = useState('');
    const [authority, setAuth] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {

        fetchChatRooms();
    }, [refreshList]);

    useEffect(() => {
        const cookieData = Cookies.get('userid');
        if (cookieData) {
            const parsedCookie = JSON.parse(cookieData);
            setCookie(parsedCookie.userId || '');
            setAuth(parsedCookie.authorityId || '');
            // console.log(">>>",parsedCookie.authorityId);
        }
    }, []);

    const fetchChatRooms = async () => {
        try {
            const response = await axios.get('/app/chat/chatRooms');

            setChatRooms(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const handleCreateRoom = async (participantId) => {
        console.log("=>",participantId)

        try {
            const existingRoom = chatRooms.find(room =>
                room.chatName.includes(cookie) && room.chatName.includes(participantId)
            );

            if (existingRoom) {
                alert('이미 이 사용자와 대화 중입니다.');
                return;
            }

            const roomName = `${cookie},${participantId}`;

            // if state = n >> update n > y

            // 기존 방이 없으면 새로운 방 생성
            await axios.post('/app/chat/createChatRoom', { chatName: roomName }, { params: { participantId: participantId } });
            fetchChatRooms();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating chat room:', error);

        }
    };

    const handleFetchCohortsInfo = async () => {
        if (!cookie) {
            console.error('User ID not found');
            return;
        }

        try {
            const response = await axios.get('/app/chat/cohortMembers', {
                params: { userId: cookie, authorityId: authority}
            });
            console.log(response.data)
            setCohortsInfo(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching cohorts info:', error);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const now = new Date();

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfToday.getDate() - 1);

        const timeDiff = (now - date) / 1000 / 60;

        if (timeDiff <= 5) {
            return "방금 전";
        } else if (date >= startOfYesterday && date < startOfToday) {
            return "어제";
        } else if (date < startOfYesterday) {
            return date.toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
            });
        } else {
            return date.toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                hour12: true,
                minute: '2-digit'
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (

        <div className="w-full bg-white shadow-md rounded-lg" style={{fontFamily: "Pretendard-Regular"}}>
            <style>
                {`
                .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                }
                `}
            </style>
            <div className="h-20 p-4 border-b font-bold flex items-center">
                <span className="flex-grow">채팅</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-blue-500 cursor-pointer" onClick={handleFetchCohortsInfo}>
                    <path fill="currentColor" fillRule="evenodd"
                          d="M4.823 15.21C2.643 9.857 6.581 4 12.361 4h.321C17 4 20.5 7.5 20.5 11.818a8.73 8.73 0 0 1-8.732 8.732h-7.82a.5.5 0 0 1-.314-.89l1.972-1.583a.5.5 0 0 0 .15-.579zM13.1 9.45a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2z"
                          clipRule="evenodd" color="#3f83f8"/>
                </svg>
            </div>

            <ul className="overflow-y-auto">
                {chatRooms.map((room) => (
                    <li
                        key={room.id}
                        className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onSelectRoom({chatId: room.chatId, name: room.participantName})}
                    >
                        <img
                            src="/profile-icon.png"
                            alt={room.participantName}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="flex-grow">
                            <div className="flex justify-between items-baseline">
                                <div className="font-semibold">{room.participantName}</div>
                                <div className="text-xs text-gray-500">{formatTime(room.lastMessageTime)}</div>
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                                {room.lastMessage}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-10">
                    <div className="relative w-1/5 bg-white rounded-lg shadow-xl">
                    <div className="bg-gray-200 rounded-t py-4 px-4 xl:px-8 flex justify-between items-center">
                            <span>대화상대 초대</span>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="w-full h-full px-4 xl:px-8 pt-3 pb-5 overflow-y-auto" style={{maxHeight:"36rem"}}>
                            <ul>
                                {cohortsInfo.map(user => (
                                    <li key={user.participantId} className="flex justify-between items-center py-3">
                                        <div className="flex items-center">
                                            <div className="mr-4 w-12 h-12 rounded shadow">
                                                <img
                                                    className="w-full h-full overflow-hidden object-cover object-center rounded"
                                                    src="/profile-icon.png"
                                                    alt="avatar"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="mb-1 text-gray-800 text-base font-normal leading-4">
                                                    {user.name}
                                                </h3>
                                                {/*<p className="text-gray-600 text-xs leading-3">*/}
                                                {/*    {user.studentId}*/}
                                                {/*</p>*/}
                                            </div>
                                        </div>
                                        <div className="relative flex items-center w-5 h-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="size-6 cursor-pointer"
                                                 viewBox="0 0 24 24" onClick={() => handleCreateRoom(user.participantId)}>
                                                <path fill="#3f83f8" stroke="#3f83f8" strokeLinejoin="round"
                                                      d="M9.92 7.408a53 53 0 0 1 .523 1.245l.003.008l.239.575l.022.052l.001.001c.1.2.202.523.022.892zm0 0c-.12-.268-.277-.48-.498-.608m.499.608L9.422 6.8m3.832 7.165a4 4 0 0 0-.185-.083l-.009-.004a6.1 6.1 0 0 1-1.769-1.114c-.647-.574-1.11-1.28-1.29-1.581c.086-.088.18-.201.255-.293l.01-.01q.073-.09.135-.162c.158-.18.23-.33.298-.473l.004-.008l.027-.056l-.776.93l-.028.016l-.402.233m3.73 2.605l-.01.018l.015-.016m-.005-.002l-.01.019l-.033.038c-.012.015-.012.011.002.002l.002-.001l.014-.008l-.008.016l-.19.382m.223-.448l.005.002m0 0a.4.4 0 0 0 .072.03s-.014-.003-.038 0a.2.2 0 0 0-.064.018l-.008.016l-.19.382m.228-.446c.189-.22.591-.693.732-.9m-.96 1.346c.258.128.41.108.56-.064c.148-.173.642-.749.816-1.005m-1.376 1.069q-.063-.031-.169-.076a6.6 6.6 0 0 1-1.903-1.2c-.767-.68-1.286-1.521-1.435-1.777m4.467 1.706l-.002.004l.418.274m-.416-.278l.002-.002l.414.28m-.416-.278c.138-.208.338-.378.62-.412c.227-.026.436.051.545.092l.004.002c.146.054.55.245.915.421c.38.183.763.371.894.436l.136.066l-.216.451m-2.482-.778c.168-.256.34-.216.578-.128c.238.089 1.504.71 1.761.837l.143.07M9.524 11.36l.401-.233l.03-.017l.069-.72l-.144.17c-.085.104-.17.206-.242.278c-.129.128-.262.266-.114.522Zm7.365 2.762l.216-.45l.012.005c.08.038.175.084.256.134a.86.86 0 0 1 .298.287m-.782.024c.179.086.3.145.352.232m.43-.256l-.578 1.477c.212-.601.212-1.113.148-1.221m.43-.256c.08.134.096.289.102.368q.013.16-.004.356a3.8 3.8 0 0 1-.205.92l-.001.003c-.167.46-.602.83-.974 1.07c-.377.242-.838.445-1.19.478m2.272-3.195l-.43.255m0 0l-1.843 2.94m0 0l-.122.014l-.06-.496l.06.496c-.24.03-.54.064-1.046-.02c-.487-.082-1.154-.273-2.154-.666c-2.57-1.011-4.241-3.482-4.575-3.975l-.006-.009l.415-.28l-.415.28l-.03-.045l-.009-.012v-.002l-.005-.005a7 7 0 0 1-.625-1.005c-.26-.513-.523-1.207-.523-1.941c0-1.385.697-2.125.99-2.436l.044-.046zM9.422 6.8c-.21-.122-.418-.127-.512-.13m.512.13l-.512-.13m0 0H8.9zM7.516 20.182a.5.5 0 0 0-.364-.044l-4.44 1.16l1.185-4.3a.5.5 0 0 0-.05-.384a9.4 9.4 0 0 1-1.263-4.703c0-5.186 4.246-9.411 9.458-9.411c2.534 0 4.906.982 6.692 2.76a9.33 9.33 0 0 1 2.766 6.656c0 5.187-4.246 9.412-9.458 9.412h-.005a9.5 9.5 0 0 1-4.52-1.146Z" />
                                            </svg>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatRoomList;
