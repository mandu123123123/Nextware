package kr.or.nextit.groupware.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentMapper mapper;

    // 댓글 리스트
    public List<CommentVO> selectComments(long postId) {
        return mapper.selectComments(postId);
    }

    // 댓글 뷰
    public CommentVO selectComment(long postId) {
        return mapper.selectComment(postId);
    }

    // 댓글 등록
    public int insertComment(CommentVO comment) {
        return mapper.insertComment(comment);
    }

    // 댓글 삭제
    public int deleteComment(long commentId) {
        return mapper.deleteComment(commentId);
    }
}
