package kr.or.nextit.groupware.note;

import lombok.Data;

import java.time.LocalDate;

@Data
public class NoteVO {
  private long noteId;
  private long responseId;
  private String userId;
  private String sender;
  private String receiver;
  private String title;
  private String content;
  private LocalDate sendDate;
  private String deleteYN;
  private String readYN;
  private int currentPage;
  private int perPage;
}
