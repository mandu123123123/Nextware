package kr.or.nextit.groupware.homework;

import lombok.Data;

import java.util.List;

@Data
public class ProblemsVO {
    private int cohortsId;
    private String title;
    private String type;
    private List<String> options;
}
