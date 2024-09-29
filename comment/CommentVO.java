package kr.or.nextit.groupware.comment;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class CommentVO {
    private long commentId;
    private long postId;
    private String userId;
    private String comment;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime registerDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime modifiedDate;
}
