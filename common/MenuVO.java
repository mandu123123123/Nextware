package kr.or.nextit.groupware.common;

import lombok.Data;

@Data
public class MenuVO {
    private int menuId;
    private String menuName;
    private String menuLink;
    private String iconName;
    private String parentId;
    private int subMenu;
}
