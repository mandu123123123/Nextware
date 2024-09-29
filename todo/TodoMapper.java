package kr.or.nextit.groupware.todo;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TodoMapper {
    List<TodoVO> selectTodos(@Param("userId") String userId);
    TodoVO selectTodo(@Param("todoId") int todoId);
    int insertTodo(TodoVO todo);
    int updateTodo(TodoVO todo);
    int deleteTodo(@Param("todoId") int todoId);
    int updateTodoCompleted(@Param("todoId") int todoId, @Param("completed") boolean completed);
}