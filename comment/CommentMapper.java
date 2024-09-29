package kr.or.nextit.groupware.comment;

import kr.or.nextit.groupware.board.BoardVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {

    List<CommentVO> selectComments(long postId);

    CommentVO selectComment(long postId);

    int insertComment(CommentVO comment);

    int deleteComment(long commentId);
}
