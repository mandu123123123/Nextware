package kr.or.nextit.groupware.board;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.nio.file.Path;
import java.time.LocalDateTime;

@Data
public class FileVO {
    private Long fileId;
    private long postId;
    private String filePath;
    private String fileName;
    private String originalName;
    private long fileSize;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime registerDate;
}
