package kr.or.nextit.groupware.organizationChart;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrganizationChartMapper {

    List<TeacherVO> selectTeacher(@Param("director") String director, @Param("teacher") String teacher);
}
