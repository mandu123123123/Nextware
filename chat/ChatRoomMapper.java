package kr.or.nextit.groupware.chat;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Mapper
public interface ChatRoomMapper {
//    List<ChatRoomVO> getAllChatRooms();
    List<ChatRoomVO> getChatRoomsWithParticipant(@Param("userId") String userId);

    void createChatRoom(ChatRoomVO chatRoom);

    void insertUserIntoChatRoom(@Param("chatId") int chatId, @Param("userId") String userId);

    // 동일 COHORTS_ID와 COHORTS_NAME을 가진 사용자를 조회
    List<ParticipantVO> getCohortMembers(String userId);

    List<ParticipantVO> getMembers(@Param("userId") String userId, @Param("authorityId") String authorityId);

    int leaveRoom(@Param("userId") String userId, @Param("chatId") int chatId);

    Integer selectDuplicateCountByChatId(@Param("chatId") int chatId);

    void deleteChatsByChatId(@Param("chatId") int chatId);

    Integer findRoom(@Param("roomName") String roomName);

    int reRoom(@Param("userId") String userId, @Param("chatId") int chatId);
}
