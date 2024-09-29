package kr.or.nextit.groupware.userinfo;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserInfoMapper {
    List<UserInfoVO> selectInfo(String userId);
    int updateInfo(UserInfoVO userInfoVO);
    UserInfoVO selectTeacherInfo(@Param("userId") String userId);
    int insertTeacherInfo(UserInfoVO userInfoVO);
    int updateTeacherInfo(UserInfoVO userInfoVO);
}
