import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import Cookies from 'js-cookie';

function ChatRoom({ chatId, name, onMessageSent, onClose}) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [cookie, setCookie] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setCookie(cookie.userId || 'No cookie found');
    }, []);

    useEffect(() => {
        fetchMessages(); // 초기 로딩 시 메시지 가져오기

        const ws = new WebSocket(`wss://nextit.or.kr:24022/ws/chat?chatRoomId=${chatId}`);
        ws.onopen = () => {
            console.log('WebSocket 연결됨');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        ws.onclose = () => {
            console.log('WebSocket 연결 종료됨');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [chatId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/app/chat/chatRooms/${chatId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage) {
            const message = {
                chatId,
                userId: cookie,
                text: newMessage,
                timestamp: new Date().toISOString(),
            };

            try {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(message));
                } else {
                    console.error('WebSocket이 연결되지 않았습니다.');
                }

                const response = await axios.post(`/app/chat/chatRooms/${chatId}/messages`, message);
                console.log('메시지 전송 성공:', response.data);
                setNewMessage('');
                onMessageSent();
            } catch (error) {
                console.error('메시지 전송 오류:', error);
            }
        }
    };

    const leaveRoom = async () => {
        const isConfirmed = window.confirm("채팅방을 나가시겠습니까?");

        if (isConfirmed) {
            try {
                const response = await axios.post(`/app/chat/leaveChatRoom`, {userId: cookie, chatId: chatId})
                console.log(response.data)
                onMessageSent();
                onClose();
            } catch (error) {
                console.error('나가기 오류', error)
            }
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-md" style={{ height: '48rem', fontFamily: "Pretendard-Regular" }}>
            <style>
                {`
                    .chat-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }

                    .chat-scrollbar::-webkit-scrollbar-track {
                        background: #ffffff;
                    }

                    .chat-scrollbar::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }

                    .chat-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }

                    .chat-scrollbar::-webkit-scrollbar-button {
                        display: none;
                    }
                `}
            </style>
            <div className="flex flex-row items-center p-4 border-b border-gray-200 justify-between">
                <div className="flex flex-row items-center">
                    <img
                        src="/profile-icon.png"
                        className="w-12 h-12 rounded-full mr-3"
                        alt="Avatar"
                    />
                    <span className="font-bold">{name}</span>
                </div>
                {/*<button onClick={leaveRoom}>나가기</button>*/}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={leaveRoom}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                </svg>

            </div>
            <div className="flex-grow overflow-y-auto px-4 py-2 chat-scrollbar">
                <MessageList messages={messages}/>
                <div ref={messagesEndRef}/>
            </div>
            <div className="flex items-center p-4 border-t border-gray-200">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
                />
                <button
                    className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    onClick={handleSendMessage}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default ChatRoom;
