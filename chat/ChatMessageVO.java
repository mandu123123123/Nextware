package kr.or.nextit.groupware.chat;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageVO {
    private String text;
    private String sender;
//    private MessageType type;
    private int chatId;
    private String timestamp;
    private String userId;
    private int mNo;
//    private String createDate;
//    private String message;

    public enum MessageType {
        ENTER, QUIT, TALK
    }
}
