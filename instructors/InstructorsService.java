package kr.or.nextit.groupware.instructors;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstructorsService {
    private final InstructorsMapper mapper;

    public InstructorsService(InstructorsMapper mapper) {
        this.mapper = mapper;
    }

    public List<InstructorsVO> selectInstructors() {
        return mapper.selectInstructors();
    }

}
