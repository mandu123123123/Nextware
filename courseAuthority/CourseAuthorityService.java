package kr.or.nextit.groupware.courseAuthority;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CourseAuthorityService {
    private final CourseAuthorityMapper mapper;

    public List<CourseAuthorityVO> selectsAuthority(String userId) {
        return mapper.selectsAuthority(userId);
    }

}
