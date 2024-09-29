package kr.or.nextit.groupware.instructors;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class InstructorsController {
    private final InstructorsService service;
    public InstructorsController(InstructorsService service) { this.service = service; }

    @GetMapping("/instructors")
    public List<InstructorsVO> selectInstructors() {
        return service.selectInstructors();
    }
}
