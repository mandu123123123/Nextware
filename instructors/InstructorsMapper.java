package kr.or.nextit.groupware.instructors;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InstructorsMapper {
    List<InstructorsVO> selectInstructors();
}
