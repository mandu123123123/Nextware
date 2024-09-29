package kr.or.nextit.groupware.login;

import kr.or.nextit.groupware.member.MemberVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginMapper {
    MemberVO login(LoginVO vo);
}
