package kr.or.nextit.groupware.note;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteService {
  private final NoteMapper mapper;
  public NoteService(NoteMapper mapper) {
    this.mapper = mapper;
  }

  @Transactional
  public int insertNoteAndResponse(NoteVO note) {
    try {
      int result = mapper.insertNote(note);
      int result1 = mapper.insertNoteResponse(note);
      return result + result1;

    }catch (Exception e) {
      System.out.println("등록 중에 오류가 발생했습니다." + e.getMessage());
      throw e;
    }
  }

  public long selectNotReadCount(NoteVO note) {
    return mapper.selectNotReadCount(note);
  }

  public List<NoteVO> selectUser(NoteVO note) {
    return mapper.selectUser(note);
  }

  public List<NoteVO> selectsSendNote(String userId, int offset, int perPage) {
    return mapper.selectsSendNote(userId, offset, perPage);
  }

  public List<NoteVO> selectsOldSendNote(String userId, int offset, int perPage) {
    return mapper.selectsOldSendNote(userId, offset, perPage);
  }

  public List<NoteVO> selectsOldReceiveNote(String userId, int offset, int perPage) {
    return mapper.selectsOldReceiveNote(userId, offset, perPage);
  }

  public List<NoteVO> selectsReceiveNote(String userId, int offset, int perPage) {
    return mapper.selectsReceiveNote(userId, offset, perPage);
  }

  public int updateNote(NoteVO note) {
    return mapper.updateNote(note);
  }

  public int updateReceiveNote(NoteVO note) {
    return mapper.updateReceiveNote(note);
  }

  public int updateReceiveNotReadNote(NoteVO note) {
    return mapper.updateReceiveNotReadNote(note);
  }

  public int deleteSendNote(long noteId) {
    return mapper.deleteSendNote(noteId);
  }

  public int deleteResponseNote(long responseId) {
    return mapper.deleteResponseNote(responseId);
  }

  public long totalCountNotes(String userId) {
    return mapper.totalCountNotes(userId);
  }

  public long totalCountReceiveNotes(String userId) {
    return mapper.totalCountReceiveNotes(userId);
  }
}
