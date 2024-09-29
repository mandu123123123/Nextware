package kr.or.nextit.groupware.courseAuthority;

import kr.or.nextit.groupware.commute.CommuteVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CourseAuthorityMapper {
    List<CourseAuthorityVO> selectsAuthority(@Param("userId") String userId);
}
