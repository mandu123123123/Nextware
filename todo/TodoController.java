package kr.or.nextit.groupware.todo;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TodoController {
    private final TodoService service;


    public TodoController(TodoService service) { this.service = service;

    }

    @GetMapping("/todoSelects")
    public List<TodoVO> selectTodos(@RequestParam("userId") String userId) {  //js에서 param으로 키를 여기로 넘김 그거를 String으로 저장 하고 service에 전달
//        System.out.println(userId);
        return service.selectTodos(userId);
    }


    @GetMapping("/todoSelect")
    public TodoVO selectTodo(@RequestParam(name="todoId") int todoId) {
        System.out.println("Received todoId: " + todoId);  // 확인용 출력
        TodoVO todo = service.selectTodo(todoId);
//        System.out.println("Fetched Todo: " + todo);
        return todo;
    }


    @PostMapping("/todoInsert")
    public String insertTodo(@RequestBody TodoVO todo) {
//        todo.setUserId("sangil");
        int insertTodo = service.insertTodo(todo);
        System.out.println("insert todo: " + insertTodo);
        if(insertTodo > 0){
            return "success";
        }
        return null;
    }

    @GetMapping("/todoUpdate")
    public TodoVO getTodo(@RequestParam(name="todoId") int todoId) {
        // 해당 ID로 할일을 찾는 로직
        TodoVO todo = service.selectTodo(todoId);
        return todo;
    }

    @PostMapping("/todoUpdate")
    public String updateTodo(@RequestBody TodoVO todo) {
        // 할일 업데이트 로직
        int updateTodo = service.updateTodo(todo);
        if (updateTodo > 0) {
            return "success";
        } else {
            return "failure"; // 명확한 실패 응답
        }
    }




    @GetMapping("/todoDelete")
    public String deleteTodo(@RequestParam(name="todoId") int todoId) {
        int deleteTodo = service.deleteTodo(todoId);
        System.out.println("delete todo: " + deleteTodo);
        if(deleteTodo > 0){
            return "success";
        }
        return null;
    }

    @PostMapping("/todoComplete")
    public String updateTodoCompleted(@RequestParam(name="todoId") int todoId,
                                      @RequestParam(name="completed") boolean completed) {
        int updateResult = service.updateTodoCompleted(todoId, completed);
        if (updateResult > 0) {
            return "success";
        } else {
            return "failure"; // 명확한 실패 응답
        }
    }
}
