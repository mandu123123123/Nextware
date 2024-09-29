package kr.or.nextit.groupware.todo;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TodoVO {
    private int todoId;
    private String userId;
    private String todoContent;
    private LocalTime registerDate;
    private LocalTime modifiedDate;
    private boolean completed;
}
