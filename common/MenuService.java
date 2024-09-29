package kr.or.nextit.groupware.common;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MenuService {
    private final MenuMapper mapper;

    public List<MenuVO> getSideMenuList(String authorityId) {
        return mapper.getSideMenuList(authorityId);
    }

    public List<MenuVO> selectSubMenus(int menuId) {
        return mapper.selectSubMenus(menuId);
    }
}
