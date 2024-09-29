package kr.or.nextit.groupware.member;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MemberService {
    private final MemberMapper mapper;
    public MemberService(MemberMapper mapper) {
        this.mapper = mapper;
    }

    public int insertMember(MemberVO vo) {
        return mapper.insertMember(vo);
    }

    public String findById(String email) {
        return mapper.findById(email);
    }

    public int findByEmail(String email) {
        return mapper.findByEmail(email);
    }

    public int changePassword(Map map) {
        return mapper.changePassword(map);
    }

    public int findUserId(String userId) {
        return mapper.findUserId(userId);
    }
    
//    관리자 페이지 추가
    public List<MemberVO> selectMembers() { return mapper.selectMembers(); }

    public int updateMember(MemberVO vo) {
        return mapper.updateMember(vo);
    }

    public int deleteMember(String userId) {
        return mapper.deleteMember(userId);
    }

    public void addStudent(Map map) {
        mapper.addStudent(map);
    }

    public void addTeacher(Map map) {
        mapper.addTeacher(map);
    }

    public List<MemberVO> getSignupList() {
        return mapper.getSignupList();
    }

    public void changeApproval(String userid) {
        mapper.changeApproval(userid);
    }

    public void insertAttendance(Map map){
        mapper.insertAttendance(map);
    }

    public void cancelApproval(String userid) {
        mapper.cancelApproval(userid);
    }

    public int uploadProfileImage(Map map) {
        return mapper.uploadProfileImage(map);
    }

    public void insertProfileImage(Map map) {
        mapper.insertProfileImage(map);
    }
    public String selectName(String userId) { return mapper.selectName(userId);}

    public void insertLeave(String leaveType, String userId) {
        mapper.insertLeave(leaveType, userId);
    }

    public String getProfileImage(String userId) {
        return mapper.getProfileImage(userId);
    }
}
