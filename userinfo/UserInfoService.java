package kr.or.nextit.groupware.userinfo;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserInfoService {
    private final UserInfoMapper mapper;

    public UserInfoService(UserInfoMapper mapper) {
        this.mapper = mapper;
    }

    public List<UserInfoVO> selectInfo(String userId) {
        return mapper.selectInfo(userId);
    }

    public int updateInfo(UserInfoVO vo) {
        return mapper.updateInfo(vo);
    }

    public int insertTeacherInfo(UserInfoVO userInfo) {
        return mapper.insertTeacherInfo(userInfo);
    }

    public UserInfoVO selectTeacherInfo(String userId) {
        return mapper.selectTeacherInfo(userId);
    }

    public int updateTeacherInfo(UserInfoVO userInfo) {
        return mapper.updateTeacherInfo(userInfo);
    }

}
