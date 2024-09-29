package kr.or.nextit.groupware.note;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NoteMapper {
  int insertNote(NoteVO note);

  int insertNoteResponse(NoteVO note);

  long selectNotReadCount(NoteVO note);

  int updateNote(NoteVO note);

  int updateReceiveNote(NoteVO note);

  int updateReceiveNotReadNote(NoteVO note);

  int deleteSendNote(@Param("noteId") long noteId);

  int deleteResponseNote(@Param("responseId") long responseId);

  long totalCountNotes(String userId);

  long totalCountReceiveNotes(String userId);

  List<NoteVO> selectUser(NoteVO note);

  List<NoteVO> selectsSendNote(@Param("userId") String userId, @Param("offset") int offset, @Param("perPage") int perPage);

  List<NoteVO> selectsOldSendNote(@Param("userId") String userId, @Param("offset") int offset, @Param("perPage") int perPage);

  List<NoteVO> selectsOldReceiveNote(@Param("userId") String userId, @Param("offset") int offset, @Param("perPage") int perPage);

  List<NoteVO> selectsReceiveNote(@Param("userId") String userId, @Param("offset") int offset, @Param("perPage") int perPage);
}
