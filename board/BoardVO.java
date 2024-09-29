package kr.or.nextit.groupware.board;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BoardVO {
    private long postId;
    private long boardId;
    private String userId;
    private String title;
    private String content;
    private int hits;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime registerDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime modifiedDate;
    private List<FileVO> fileList;
}
