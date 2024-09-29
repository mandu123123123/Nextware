package kr.or.nextit.groupware.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ChatRoomService chatRoomService;

    // 각 채팅방에 대한 WebSocket 세션을 저장합니다.
    private final Map<Integer, Set<WebSocketSession>> chatRoomSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Integer chatRoomId = getChatRoomId(session); // 세션에서 채팅방 ID 추출
        if (chatRoomId != null) {
            chatRoomSessions.computeIfAbsent(chatRoomId, k -> Collections.newSetFromMap(new ConcurrentHashMap<>()))
                    .add(session);
            log.info("WebSocket 연결됨, 채팅방 ID: {}", chatRoomId);
        } else {
            log.warn("채팅방 ID가 없어 WebSocket 연결을 거부함: {}", session.getUri());
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid chat room ID"));
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        ChatMessageVO chatMessageVO = objectMapper.readValue(payload, ChatMessageVO.class);

        Integer chatRoomId = chatMessageVO.getChatId();
        Set<WebSocketSession> sessions = chatRoomSessions.get(chatRoomId);
        if (sessions != null) {
            TextMessage textMessage = new TextMessage(objectMapper.writeValueAsString(chatMessageVO));
            sendToEachSocket(sessions, textMessage);
        } else {
            log.warn("채팅방 ID {}에 대한 세션이 없음", chatRoomId);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket 에러 발생", exception);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Integer chatRoomId = getChatRoomId(session); // 세션에서 채팅방 ID 추출
        if (chatRoomId != null) {
            Set<WebSocketSession> sessions = chatRoomSessions.get(chatRoomId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    chatRoomSessions.remove(chatRoomId);
                }
            }
            log.info("WebSocket 종료됨, 채팅방 ID: {}", chatRoomId);
        }
    }

    private void sendToEachSocket(Set<WebSocketSession> sessions, TextMessage message) {
        sessions.parallelStream().forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(message);
                }
            } catch (IOException e) {
                log.error("메시지 전송 오류", e);
            }
        });
    }

    private Integer getChatRoomId(WebSocketSession session) {
        String uri = session.getUri().toString();
        String[] parts = uri.split("\\?");
        if (parts.length > 1) {
            String query = parts[1];
            for (String param : query.split("&")) {
                String[] pair = param.split("=");
                if (pair.length == 2 && "chatRoomId".equals(pair[0])) {
                    try {
                        return Integer.parseInt(pair[1]);
                    } catch (NumberFormatException e) {
                        log.error("채팅방 ID 형식 오류", e);
                    }
                }
            }
        }
        log.warn("채팅방 ID를 URI에서 찾을 수 없음: {}", uri);
        return null; // 또는 적절한 기본값
    }
}
