package kr.or.nextit.groupware.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/app/chat")
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

//    참가한 채팅방 리스트 가져오기
    @GetMapping("/chatRooms")
    public ResponseEntity<List<ChatRoomVO>> getChatRoomsWithParticipant(HttpServletRequest request) {
        String userIdCookie = getUserIdFromCookie(request);
        String userId;

        if (userIdCookie == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            String decodedCookie = URLDecoder.decode(userIdCookie, StandardCharsets.UTF_8.name());
            userId = extractUserIdFromJson(decodedCookie);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

//        userId로 참가한 채팅방 조회
        List<ChatRoomVO> chatRooms = chatRoomService.getChatRoomsWithParticipant(userId);
        return new ResponseEntity<>(chatRooms, HttpStatus.OK);
    }

//    방만들기
    @PostMapping("/createChatRoom")
    public ResponseEntity<ChatRoomVO> createChatRoom(@RequestBody ChatRoomVO chatRoom,
                                                     @CookieValue(value = "userid") String userId,
                                                     @RequestParam("participantId") String participantId) {
        System.out.println("parID: " + participantId);
        String loggedInUserId = userId;
        String roomName = chatRoom.getChatName();
        System.out.println("roomName: " + roomName);

        try {
            String decodedCookie = URLDecoder.decode(loggedInUserId, StandardCharsets.UTF_8.name());
            userId = extractUserIdFromJson(decodedCookie);

        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        ChatRoomVO createdChatRoom = null;
        System.out.println("??"+chatRoomService.findRoom(roomName));
        Integer chatId = chatRoomService.findRoom(roomName);
//        만들기 전 상대방과 대화하고 있던 방이 있는지 확인
        if (chatRoomService.findRoom(roomName) != null) {
            //있는데 채팅방 리스트에 없으면 비활성화 상태임 그거 활성화
            chatRoomService.reRoom(userId, chatId);
        } else {
            //없으면 방 새로 만듬
            createdChatRoom = chatRoomService.createChatRoom(chatRoom, userId, participantId);
        }

        return new ResponseEntity<>(createdChatRoom, HttpStatus.CREATED);
    }

    private String getUserIdFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("userid".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;  // 쿠키가 없으면 null 반환
    }
    private String extractUserIdFromJson(String jsonString) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, Object> map = objectMapper.readValue(jsonString, Map.class);

        return (String) map.get("userId");
    }

    // 동일 COHORTS_ID와 COHORTS_NAME을 가진 사용자를 조회
    @GetMapping("/cohortMembers")
    public ResponseEntity<List<ParticipantVO>> getCohortMembers(@RequestParam("userId") String userId, @RequestParam("authorityId") String authorityId) {
        System.out.println(">>>" + userId);
        System.out.println(">>" + authorityId);
//        List<ParticipantVO> members = null;
        Set<ParticipantVO> memberSet = new HashSet<>();
        //1. 학생계정일 경우 같은기수 학생 + 선생님 목록 조회
        if(Objects.equals(authorityId, "A003")) {
//            System.out.println("여기탐");
            memberSet.addAll(chatRoomService.getCohortMembers(userId));
            memberSet.addAll(chatRoomService.getMembers(userId, authorityId));
        }
        else{
//            System.out.println("아님 여기탐");
            memberSet.addAll(chatRoomService.getMembers(userId, authorityId));
        }
        List<ParticipantVO> members = new ArrayList<>(memberSet);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    @PostMapping("/leaveChatRoom")
    public boolean leaveRoom(@RequestBody Map<String, Object> payload){
        String userId = (String) payload.get("userId");
        int chatId = (int) payload.get("chatId");

//        System.out.println("아이디" + payload.get("userId"));
//        System.out.println("채팅방번호" + payload.get("chatId"));
        int update = chatRoomService.leaveRoom(userId, chatId);
        if (update > 0) {
            // 3. 특정 chat_id에서 중복된 상태가 'N'인 레코드가 있는지 확인
            boolean hasDuplicates = chatRoomService.hasDuplicateStateN(chatId);

            // 4. 중복된 레코드가 존재할 경우 해당 chat_id의 데이터를 삭제
            if (hasDuplicates) {
                chatRoomService.deleteChatsByChatId(chatId);
            }
        }
        return update > 0;
    }
}
