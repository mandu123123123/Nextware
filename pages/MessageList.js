import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function MessageList({ messages }) {
    const [cookie, setCookie] = useState([]);

    useEffect(() => {
        const cookie = JSON.parse(Cookies.get('userid'));
        setCookie(cookie.userId || 'No cookie found');
    }, []);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const formatDay = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', { weekday: 'long' });
    };

    const renderMessages = () => {
        let lastDate = null;
        return messages.map((message) => {
            const messageDate = formatDate(message.timestamp);
            const isNewDate = messageDate !== lastDate;
            lastDate = messageDate;

            return (
                <div key={message.id}>
                    {isNewDate && (
                        <div className="text-center text-gray-500 text-xs mt-4 mb-2">
                            <span>{`${formatDate(message.timestamp)} ${formatDay(message.timestamp)}`}</span>
                        </div>
                    )}
                    <div
                        className={`flex flex-col ${message.userId === cookie ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                                message.userId === cookie
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                </div>
            );
        });
    };

    return <div className="flex flex-col space-y-4">{renderMessages()}</div>;
}

export default MessageList;
