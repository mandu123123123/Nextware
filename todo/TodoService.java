package kr.or.nextit.groupware.todo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TodoService {
    private final TodoMapper mapper;

    public List<TodoVO> selectTodos(String userId){
        return mapper.selectTodos(userId);
    }

    public TodoVO selectTodo(int todoId){
        return mapper.selectTodo(todoId);
    }

    public int insertTodo(TodoVO todo) {
        return mapper.insertTodo(todo);
    }

    public int updateTodo(TodoVO todo) { return mapper.updateTodo(todo);
    }
    public int deleteTodo(int todoId) {
        return mapper.deleteTodo(todoId);
    }

    public int updateTodoCompleted(int todoId, boolean completed){
      return mapper.updateTodoCompleted(todoId, completed);
    }


}