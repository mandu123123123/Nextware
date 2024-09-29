package kr.or.nextit.groupware.board;

import org.springframework.core.io.FileUrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class BoardController {

    private final BoardService service;

    public BoardController(BoardService service) {
        this.service = service;
    }

    // 게시글 목록
    @GetMapping("/board")
    public Map<String, Object> selectBoards(@RequestParam(name = "boardId") long boardId, @RequestParam(name = "currentPage") int currentPage, @RequestParam(name = "perPage") int perPage, @RequestParam(name = "searchType", required = false) String searchType, @RequestParam(name = "searchWord", required = false) String searchWord) {
        int offset = (currentPage - 1) * perPage;

        List<SearchVO> boards = service.selectBoards(boardId, offset, perPage, searchType, searchWord);

        long totalCountBoards = service.totalCountBoards(boardId, searchType, searchWord);

        if(boards != null) {
            return Map.of("boards", boards , "totalCount", totalCountBoards);
        } else {
            return Map.of("result", "failure");
        }
    }

    // 게시글 조회
    @GetMapping("/board-detail")
    public BoardVO selectBoard(@RequestParam(name = "postId") long postId) {
        return service.selectBoard(postId);
    }

    // 게시글 등록
    @PostMapping("/board-new")
    public Map<String, Object> insertBoard(@RequestParam("boardId") long boardId, @RequestParam("title") String title, @RequestParam("content") String content, @RequestParam("userId") String userId, @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {

        // 업로드한 파일이 저장될 위치
        String uploadFile = "src/main/resources/static/files";

        Path uploadPath = Paths.get(uploadFile);
        if (!Files.exists(uploadPath)) {
            Files.createDirectory(uploadPath);
        }

        List<FileVO> filesList = new ArrayList<>();

        // 첨부한 파일이 있는 경우에만 파일 등록
        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {

                    FileVO vo = new FileVO();
                    String filename = UUID.randomUUID().toString();
                    vo.setFileName(filename);
                    vo.setOriginalName(file.getOriginalFilename());
                    vo.setFileSize(file.getSize());
                    vo.setFilePath(uploadFile);
                    filesList.add(vo);

                    String fileName = filename + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    file.transferTo(filePath);
                }
            }
        }

        BoardVO board = new BoardVO();
        board.setBoardId(boardId);
        board.setTitle(title);
        board.setContent(content);
        board.setUserId(userId);
        board.setFileList(filesList);

        int inserted = service.insertBoard(board);

        if (inserted > 0) {
            return Map.of("result", "success", "boardId", board.getBoardId());
        } else {
            return Map.of("result", "failure");
        }
    }

    // 게시글 수정
    @GetMapping("/board-modify")
    public BoardVO updateBoard(@RequestParam(name = "postId") long postId, Model model) {
        BoardVO board = service.selectBoard(postId);
        model.addAttribute("board", board);
        return board;
    }

    @PostMapping("/board-modify")
    public Map<String, Object> updateBoard(@RequestParam("title") String title, @RequestParam("content") String content, @RequestParam("postId") long postId, @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {

        BoardVO board = service.selectBoard(postId);
        board.setTitle(title);
        board.setContent(content);

        // 업로드한 파일이 저장될 위치
        String uploadFile = "src/main/resources/static/files";

        Path uploadPath = Paths.get(uploadFile);
        if (!Files.exists(uploadPath)) {
            Files.createDirectory(uploadPath);
        }

        // 기존 파일 목록을 유지
        List<FileVO> existingFiles = board.getFileList();

        List<FileVO> newFiles = new ArrayList<>();

        // 새로운 파일 업로드 처리
        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFilename = file.getOriginalFilename();
                    long fileSize = file.getSize();
                    String filename = UUID.randomUUID().toString();
                    Path filePath = uploadPath.resolve(filename + "_" + file.getOriginalFilename());
                    file.transferTo(filePath);

                    // 새로운 파일 정보를 FileVO에 추가
                    FileVO vo = new FileVO();
                    vo.setPostId(postId);
                    vo.setFileSize(fileSize);
                    vo.setFileName(filename);
                    vo.setOriginalName(originalFilename);
                    vo.setFilePath(uploadFile);
                    newFiles.add(vo);
                }
            }
        }

        // 기존 파일 목록과 새로운 파일 목록을 합침
        if (existingFiles != null) {
            existingFiles.addAll(newFiles);
        } else {
            existingFiles = newFiles;
        }
        board.setFileList(existingFiles);

        int updated = service.updateBoard(board);

        if (updated > 0) {
            return Map.of("result", "success", "postId", postId);
        } else {
            return Map.of("result", "failure");
        }
    }

    // 게시글 삭제
    @GetMapping("/board-delete")
    public Map<String, Object> deleteBoard(@RequestParam(name = "postId") long postId, @RequestParam(name = "boardId") long boardId) {

        // 게시글에 첨부된 파일들 정보 조회
        List<FileVO> files = service.selectFiles(postId);

        // DB에 저장된 게시글 삭제
        boolean boardDeleted = service.deleteBoard(postId);

        // DB에 저장된 게시글 삭제 성공하면 디렉토리에 저장된 파일도 삭제하기
        if (boardDeleted) {
            for (FileVO vo : files) {
                String fileName = vo.getFileName() + "_" + vo.getOriginalName();
                String filePath = vo.getFilePath();
                File file = new File(filePath + "/" + fileName);

                // 파일 존재 여부 및 삭제
                if (file.exists()) {
                    boolean deleteFile = file.delete(); // 디렉토리에서 파일 삭제
                    if (deleteFile) {
                        System.out.println("파일 삭제 성공");
                    } else {
                        System.out.println("파일 삭제 실패");
                        return Map.of("result", "failure");
                    }
                }
            }
        }
        return Map.of("result", "success", "boardId", boardId);
    }


    /* ------- 조회수 ------- */

    // 조회수 증가
    @GetMapping("/update-hits")
    public int updateHits(@RequestParam(name = "postId") long postId) {
        return service.updateHits(postId);
    }


    /* ------- 파일 ------- */

    // 파일 조회
    @GetMapping("/files")
    public List<FileVO> selectFiles(@RequestParam(name = "postId") long postId) {
        return service.selectFiles(postId);
    }

    // 파일 다운로드
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> download(@PathVariable("fileId") long fileId) throws MalformedURLException, UnsupportedEncodingException {

        // 파일 정보 조회
        FileVO file = service.selectFile(fileId);

        // 파일이 저장되어 있는 위치
        String uploadFile = "src/main/resources/static/files/";

        Path path = Paths.get(uploadFile + file.getFileName() + "_" + file.getOriginalName());
        String filename = URLEncoder.encode(file.getOriginalName(), StandardCharsets.UTF_8);

        // 파일 존재 여부 확인
        if (!Files.exists(path)) {
            System.out.println("파일 없음");
            return ResponseEntity.notFound().build();
        }

        FileUrlResource resource = new FileUrlResource(path.toString());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.getFileSize())
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + filename + "\";")
                .body(resource);
    }

    // 파일 삭제
    @GetMapping("/file-delete")
    public Map<String, Object> fileDelete(@RequestParam(name = "fileId") long fileId) {

        // 파일 정보 조회
        FileVO vo = service.selectFile(fileId);

        // DB에 저장된 파일 삭제
        boolean isDeleted = service.fileDelete(fileId);

        // DB에 저장된 파일 삭제 성공하면 디렉토리에 저장된 파일도 삭제하기
        if (isDeleted) {
            String fileName = vo.getFileName() + "_" + vo.getOriginalName();
            String filePath = vo.getFilePath();
            File file = new File(filePath + "/" + fileName);

            // 파일 존재 여부 및 삭제
            if (file.exists()) {
                boolean fileDeleted = file.delete(); // 디렉토리에서 파일 삭제
                if (fileDeleted) {
                    System.out.println("파일 삭제 성공");
                    return Map.of("result", "success", "fileId", fileId);
                } else {
                    System.out.println("파일 삭제 실패");
                    return Map.of("result", "failure");
                }
            }
        }
        return Map.of("result", "success", "fileId", fileId);
    }
}
