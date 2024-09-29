package kr.or.nextit.groupware.comment;

import kr.or.nextit.groupware.board.BoardService;
import kr.or.nextit.groupware.board.BoardVO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class CommentController {

    private final CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }
    
    // 리스트
    @GetMapping("/comment")
    public List<CommentVO> selectComments(@RequestParam (name = "postId") long postId) {
        return service.selectComments(postId);
    }
    
    // 등록
    @PostMapping("/comment-new")
    public Map<String, Object> insertComment(@RequestBody CommentVO comment){
        long postId = comment.getPostId();
        String userId = comment.getUserId();
        String newComment = comment.getComment();

        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setComment(newComment);

        int inserted = service.insertComment(comment);

        if(inserted > 0){
            return Map.of("result", "success", "postId", postId);
        }  else {
            return Map.of("result", "failure");
        }

    }

    // 삭제
    @GetMapping("/comment-delete")
    public Map<String, Object> deleteComment(@RequestParam (name = "commentId") long commentId){
        int deleted = service.deleteComment(commentId);
        if(deleted > 0){
            return Map.of("result", "success", "commentId", commentId);
        } else {
            return Map.of("result", "failure");
        }
    }
}
