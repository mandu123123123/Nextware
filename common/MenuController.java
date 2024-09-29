package kr.or.nextit.groupware.common;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class MenuController {
    private final MenuService service;

    @GetMapping("/getSideMenuList")
    public List<MenuVO> getSideMenuList(@RequestParam("authorityId") String authorityId) {
        List<MenuVO> list = service.getSideMenuList(authorityId);
        return list;
    }

    @PostMapping("/selectSubMenu")
    public List<MenuVO> selectSubMenu(@RequestBody Map map) {
        List<MenuVO> subMenu = service.selectSubMenus((Integer) map.get("menuId"));
        return subMenu;
    }
}
