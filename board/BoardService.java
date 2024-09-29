package kr.or.nextit.groupware.board;

import kr.or.nextit.groupware.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final BoardMapper mapper;
    private final FileMapper fileMapper;
    private final CommentMapper commentMapper;

    // 보드 리스트
    public List<SearchVO> selectBoards(long boardId, int offset, int perPage, String searchType, String searchWord) {
        return mapper.selectBoards(boardId, offset, perPage, searchType, searchWord);
    }

    // 보드 리스트 개수
    public long totalCountBoards(long boardId, String searchType, String searchWord) {
        return mapper.totalCountBoards(boardId, searchType, searchWord);
    }

    // 보드 조회
    public BoardVO selectBoard(long postId) {
        return mapper.selectBoard(postId);
    }

    // 보드 등록
    @Transactional
    public int insertBoard(BoardVO board) {
        int inserted = mapper.insertBoard(board);
        long postId = board.getPostId();

        List<FileVO> fileList = board.getFileList();

        if(!fileList.isEmpty()) {
            fileList.forEach(f -> f.setPostId(postId));
            fileMapper.saveFiles(fileList);
        }
        return inserted;
    }

    // 보드 수정
    @Transactional
    public int updateBoard(BoardVO board) {
        int result = mapper.updateBoard(board);

        long postId = board.getPostId();

        for(FileVO file : board.getFileList()) {
            if (file.getFileId() == null) {
                file.setPostId(postId);
                fileMapper.insertFile(file);
            }
        }
        return result;
    }

    // 보드 삭제
    @Transactional
    public boolean deleteBoard(long postId) {
        fileMapper.deleteFile(postId);
        commentMapper.deleteComment(postId);
        return mapper.deleteBoard(postId);
    }


    /* ------- 조회수 ------- */

    // 조회수 증가
    public int updateHits(long postId) {
        return mapper.updateHits(postId);
    }


    /* ------- 파일 ------- */
    
    // 한 개의 파일 정보 조회
    public FileVO selectFile(long fileId) {
        return fileMapper.selectFile(fileId);
    }

    // 게시글에 첨부된 파일들 조회
    public List<FileVO> selectFiles(long fileId) {
        return fileMapper.selectFiles(fileId);
    }

    // 파일 업데이트
    public FileVO updateFiles(long postId) {
        return fileMapper.updateFiles(postId);
    }

    // 파일 삭제
    public boolean fileDelete(long fileId) {
        return fileMapper.fileDelete(fileId);
    }

}
