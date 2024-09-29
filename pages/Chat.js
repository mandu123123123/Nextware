import React, {useCallback, useEffect, useState} from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import Cookies from "js-cookie";

function Chat() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [cookie, setCookie] = useState([]);
    const [refreshList, setRefreshList] = useState(false);

    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setCookie(cookie.userId || 'No cookie found');

    }, []);

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
    };

    const handleRefreshList = useCallback(() => {
        setRefreshList(prev => !prev);
    }, []);

    const handleCloseRoom = () => {
        setSelectedRoom(null);
    };

    return (
        <div className="flex flex-row" style={{width: "100%", fontFamily: "Pretendard-Regular"}}>
            <div className="flex-none w-1/4 mr-4 mt-8">
                <ChatRoomList onSelectRoom={handleSelectRoom} refreshList={refreshList}/>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mt-8" style={{height: "50rem"}}>
                {selectedRoom && <ChatRoom chatId={selectedRoom.chatId} name={selectedRoom.name} onMessageSent={handleRefreshList} onClose={handleCloseRoom}/>}
            </div>
        </div>
    );
}

export default Chat;
