package kr.or.nextit.groupware.board;


import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FileMapper {

    // 첨부파일 저장
    void saveFiles(List<FileVO> files);

    // 한 게시글의 파일 목록 가져오기
    List<FileVO> selectFiles(long postId);

    // 한 개의 파일을 다운로드할 때 파일 정보 가져오기
    FileVO selectFile(long fileId);

    // 파일 업데이트
    FileVO updateFiles(long postId);

    // 파일 등록
    void insertFile(FileVO file);

    // 게시글 삭제될 때 파일도 같이 삭제
    int deleteFile(long postId);

    // 파일 하나만 삭제
    boolean fileDelete(long fileId);
}
