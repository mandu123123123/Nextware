package kr.or.nextit.groupware.chat;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/app/chat")
public class ChatController {
    private final ChatMessageService chatMessageService;

    @GetMapping("/chatRooms/{chatId}/messages")
    public List<ChatMessageVO> getMessages(@PathVariable("chatId") int chatId) {
        System.out.println(chatId);
        return chatMessageService.getMessagesByRoomId(chatId);
    }

    @PostMapping("/chatRooms/{chatId}/messages")
    public ChatMessageVO sendMessage(@PathVariable("chatId") int chatId, @RequestBody ChatMessageVO message) {
        boolean hasDuplicates = chatMessageService.hasDuplicateStateN(chatId);
        if (hasDuplicates) {
            chatMessageService.reRoom(chatId);
        }
        System.out.println("message");
        System.out.println(message);
        message.setChatId(chatId);
        return chatMessageService.saveMessage(message);
    }
}
