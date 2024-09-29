package kr.or.nextit.groupware.login;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.nextit.groupware.member.MemberVO;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@RestController
public class LoginController {
    private final LoginService service;
    public LoginController(LoginService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginVO vo, HttpServletResponse response) throws UnsupportedEncodingException, JsonProcessingException {
        MemberVO login = service.login(vo);

        if(login != null) {
            if(login.getApproval().equals("Y")){
                // 객체를 JSON 문자열로 변환
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.registerModule(new JavaTimeModule());
                String memberJson = objectMapper.writeValueAsString(login);

                // 쿠키 생성
                String cookieValue = URLEncoder.encode(memberJson, "UTF-8");
                Cookie cookie = new Cookie("userinfo", cookieValue);
                Cookie cookieid = new Cookie("userid", cookieValue);
                // 쿠키의 유효 시간 설정 (초 단위)
                cookie.setMaxAge(60 * 60 * 12); // 1시간
                cookieid.setMaxAge(60 * 60 * 12);
                // 쿠키의 경로 설정 (옵션)
                cookie.setPath("/");
                cookieid.setPath("/");
                // 쿠키를 응답에 추가
                response.addCookie(cookie);
                response.addCookie(cookieid);
                return "success";
            } else if (login.getApproval().equals("N")) {
                return "not";
            }
        }
        return "fail";
    }
}
