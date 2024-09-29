package kr.or.nextit.groupware.chat;

import lombok.Data;


@Data
public class ChatRoomVO {
    private int chatId;
    private String chatName;
    private String participantName; //상대방이름
    private String lastMessage;
    private String lastMessageTime;
}
