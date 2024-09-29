package kr.or.nextit.groupware.member;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MemberMapper {
    int insertMember(MemberVO vo);

    String findById(String email);

    int findByEmail(String email);

    int changePassword(Map map);

    int findUserId(String userId);
    
    //관리자 페이지 추가
    List<MemberVO> selectMembers();

    int updateMember(MemberVO vo);

    int deleteMember(String userId);

    void addStudent(Map map);

    void addTeacher(Map map);

    List<MemberVO> getSignupList();

    void changeApproval(String userid);

    void insertAttendance(Map map);

    void cancelApproval(String userid);

    int uploadProfileImage(Map map);

    void insertProfileImage(Map map);

    String selectName(@Param("userId") String userId);

    void insertLeave(@Param("leaveType") String leaveType, @Param("userId") String userId);

    String getProfileImage(String userId);
}
