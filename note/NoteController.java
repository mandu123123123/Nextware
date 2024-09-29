package kr.or.nextit.groupware.note;

import kr.or.nextit.groupware.board.BoardVO;
import kr.or.nextit.groupware.commute.CommuteVO;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class NoteController {
  private final NoteService service;

  public NoteController(NoteService service) {
    this.service = service;
  }

  @PostMapping("/note/insert")
  public String insertNote(@RequestBody NoteVO note) {
    service.insertNoteAndResponse(note);
    return "Inserted Note";
  }

  @PostMapping("notReadCount/select")
  public long selectNotReadCount(@RequestBody NoteVO note) {
    return service.selectNotReadCount(note);
  }

  @PostMapping("/user/select")
  public List<NoteVO> selectUser(@RequestBody NoteVO note) {
    return service.selectUser(note);
  }

  // 보낸 쪽지함 최신순 조회
  @PostMapping("/sendNote/selects")
  public Map<String, Object> selectsSendNote(@RequestBody NoteVO note){

    int offset = (note.getCurrentPage() - 1) * note.getPerPage();

    List<NoteVO> notes = service.selectsSendNote(note.getUserId(), offset, note.getPerPage());
    long totalCount = service.totalCountNotes(note.getUserId());

    System.out.println("노츠 " + notes);

    if(notes != null) {
      return Map.of("notes", notes , "totalCount", totalCount);
    } else {
      return Map.of("result", "failure");
    }
  }

  // 보낸 쪽지함 과거순 조회
  @PostMapping("/oldSendNote/selects")
  public Map<String, Object> selectsOldSendNote(@RequestBody NoteVO note){

    int offset = (note.getCurrentPage() - 1) * note.getPerPage();

    List<NoteVO> oldNotes = service.selectsOldSendNote(note.getUserId(), offset, note.getPerPage());
    long totalCount = service.totalCountNotes(note.getUserId());

    System.out.println("올드노츠 " + oldNotes);

    if(oldNotes != null) {
      return Map.of("oldNotes", oldNotes , "totalCount", totalCount);
    } else {
      return Map.of("result", "failure");
    }
  }

  // 받은 쪽지함 과거순 조회
  @PostMapping("/oldReceiveNote/selects")
  public Map<String, Object> selectsOldReceiveNote(@RequestBody NoteVO note){

    int offset = (note.getCurrentPage() - 1) * note.getPerPage();

    List<NoteVO> oldReceiveNotes = service.selectsOldReceiveNote(note.getUserId(), offset, note.getPerPage());
    long totalCount = service.totalCountNotes(note.getUserId());

    System.out.println("올드노츠 " + oldReceiveNotes);

    if(oldReceiveNotes != null) {
      return Map.of("oldReceiveNotes", oldReceiveNotes , "totalCount", totalCount);
    } else {
      return Map.of("result", "failure");
    }
  }

  // 받은 쪽지함 최신순 조회
  @PostMapping("/receiveNote/selects")
  public Map<String, Object> selectsReceiveNote(@RequestBody NoteVO note){
    int offset = (note.getCurrentPage() - 1) * note.getPerPage();

    List<NoteVO> receiveNotes = service.selectsReceiveNote(note.getUserId(), offset, note.getPerPage());
    long totalCount = service.totalCountReceiveNotes(note.getUserId());

    System.out.println("노츠 " + receiveNotes);

    if(receiveNotes != null) {
      return Map.of("receiveNotes", receiveNotes , "totalCount", totalCount);
    } else {
      return Map.of("result", "failure");
    }
  }

  @PostMapping("/note/update")
  public String updateNote(@RequestBody NoteVO note) {
    service.updateNote(note);
    return "Updated Note";
  }

  @PostMapping("/receiveNote/update")
  public String updateReceiveNote(@RequestBody NoteVO note) {
    service.updateReceiveNote(note);
    return "Updated Note";
  }

//  @PostMapping("/notReadNote/update")
//  public String updateNotReadNote(@RequestBody NoteVO note) {
//    service.updateNotReadNote(note);
//    return "Updated Note";
//  }

  @PostMapping("/receiveNotReadNote/update")
  public String updateReceiveNotReadNote(@RequestBody NoteVO note) {
    service.updateReceiveNotReadNote(note);
    return "Updated Note";
  }

  @PostMapping("/sendNote/delete")
  public String deleteSendNote(@RequestParam(name = "noteId") long noteId) {
    service.deleteSendNote(noteId);
    return "Deleted Note";
  }

  @PostMapping("/responseNote/delete")
  public String deleteResponseNote(@RequestParam(name = "responseId") long responseId) {
    service.deleteResponseNote(responseId);
    return "Deleted Note";
  }
}
