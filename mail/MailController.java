package kr.or.nextit.groupware.mail;

import kr.or.nextit.groupware.member.MemberService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
public class MailController {
    private final MailService mailService;
    private final MemberService memberService;

    public MailController(MailService mailService, MemberService memberService) {
        this.mailService = mailService;
        this.memberService = memberService;
    }

    @PostMapping("/send/mail")
    public CompletableFuture<Map<String, String>> sendMail(@RequestBody Map<String, String> map) {
        return mailService.sendMail(map.get("email"))
                .thenApply(emailResult -> {
                    String changeId = memberService.findById(map.get("email"));
                    Map<String, String> result = new HashMap<>();

                    if ("success".equals(emailResult.get("message"))) {
                        result.put("status", "success");
                        result.put("code", emailResult.get("code"));
                        result.put("userId", changeId);
                    } else {
                        result.put("status", "fail");
                    }

                    return result;
                });
    }

//    @PostMapping("/send/mail")
//    public CompletableFuture<Map<String, String>> sendMail(@RequestBody Map<String, String> map) throws Exception {
//        Map email = (Map) mailService.sendMail(map.get("email"));
//        String changeId = memberService.findById(map.get("email"));
//
//        Map<String, String> result = new HashMap();
//
//        if(email.get("messege").equals("success")) {
//            result.put("status", "success");
//            result.put("code", email.get("code"));
//            result.put("userId", changeId);
//        } else {
//            result.put("status", "fail");
//        }
//
//        return result;
//    }
}
