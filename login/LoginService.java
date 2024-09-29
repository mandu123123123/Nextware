package kr.or.nextit.groupware.login;

import kr.or.nextit.groupware.member.MemberVO;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final LoginMapper mapper;
    public LoginService(LoginMapper mapper) {
        this.mapper = mapper;
    }

    public MemberVO login(LoginVO vo) {
        return mapper.login(vo);
    }

}
