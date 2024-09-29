package kr.or.nextit.groupware.chat;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatMessageMapper {
    List<ChatMessageVO> getMessagesByRoomId(int roomId);

    void saveMessage(ChatMessageVO message);

    Integer selectDuplicateCountByChatId(@Param("chatId") int chatId);

    int reRoom(@Param("chatId") int chatId);
}
