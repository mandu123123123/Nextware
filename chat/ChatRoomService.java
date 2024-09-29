package kr.or.nextit.groupware.chat;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomMapper chatRoomMapper;

    @Transactional
    public List<ChatRoomVO> getChatRoomsWithParticipant(String userId) {
        return chatRoomMapper.getChatRoomsWithParticipant(userId);
    }

    @Transactional
    public ChatRoomVO createChatRoom(ChatRoomVO chatRoom, String loggedInUserId, String participantId) {
        // 1. chat_room 테이블에 방 정보 삽입
        chatRoomMapper.createChatRoom(chatRoom);

        // 2. 방 생성 후 chatId가 생성되었는지 확인
        int chatId = chatRoom.getChatId();
        System.out.println(">>>>" + loggedInUserId);
        // 3. chat_user_map 테이블에 로그인한 사용자와 상대방을 방에 매핑
        chatRoomMapper.insertUserIntoChatRoom(chatId, loggedInUserId);
        chatRoomMapper.insertUserIntoChatRoom(chatId, participantId);

        return chatRoom;
    }

    @Transactional
    public List<ParticipantVO> getCohortMembers(String userId) {
        return chatRoomMapper.getCohortMembers(userId);
    }

    @Transactional
    public List<ParticipantVO> getMembers(String userId, String authorityId){
        return chatRoomMapper.getMembers(userId, authorityId);
    }

    @Transactional
    public int leaveRoom(String userId, int chatId) {
        return chatRoomMapper.leaveRoom(userId, chatId);
    }

    @Transactional
    public boolean hasDuplicateStateN(int chatId) {
        Integer count = chatRoomMapper.selectDuplicateCountByChatId(chatId);
        return count != null && count > 1;
    }

    @Transactional
    public void deleteChatsByChatId(int chatId) {
        chatRoomMapper.deleteChatsByChatId(chatId);
    }

    @Transactional
    public Integer findRoom(String roomName){
        return chatRoomMapper.findRoom(roomName);
    }

    @Transactional
    public int reRoom(String userId, int chatId){
        return chatRoomMapper.reRoom(userId, chatId);
    }
}
