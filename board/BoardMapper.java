package kr.or.nextit.groupware.board;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardMapper {

    // 게시글 목록 조회
    List<SearchVO> selectBoards(@Param("boardId") long boardId, @Param("offset") int offset, @Param("perPage") int perPage, @Param("searchType") String searchType, @Param("searchWord") String searchWord);

    // 게시글 개수
    long totalCountBoards(@Param("boardId") long boardId, @Param("searchType") String searchType, @Param("searchWord") String searchWord);

    // 한 개의 게시글에 담긴 정보 조회
    BoardVO selectBoard(@Param("postId") long postId);

    // 조회수 증가
    int updateHits(long postId);

    // 게시글 등록
    int insertBoard(BoardVO board);

    // 게시글 수정
    int updateBoard(BoardVO board);

    // 게시글 삭제
    boolean deleteBoard(@Param("postId") long postId);
}
