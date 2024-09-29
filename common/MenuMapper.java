package kr.or.nextit.groupware.common;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuMapper {

    List<MenuVO> getSideMenuList(String authorityId);

    List<MenuVO> selectSubMenus(int menuId);
}
