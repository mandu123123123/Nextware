package kr.or.nextit.groupware.chat;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageMapper chatMessageMapper;

    public List<ChatMessageVO> getMessagesByRoomId(int chatId) {
        return chatMessageMapper.getMessagesByRoomId(chatId);
    }

    public ChatMessageVO saveMessage(ChatMessageVO message) {
        chatMessageMapper.saveMessage(message);
        return message;
    }

    @Transactional
    public boolean hasDuplicateStateN(int chatId) {
        Integer count = chatMessageMapper.selectDuplicateCountByChatId(chatId);
        return count != null && count >= 1;
    }

    @Transactional
    public int reRoom(int chatId){
        return chatMessageMapper.reRoom(chatId);
    }
}
