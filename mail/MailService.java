package kr.or.nextit.groupware.mail;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class MailService {
    private final MailUtil mailUtil;

    public MailService(MailUtil mailUtil) {
        this.mailUtil = mailUtil;
    }

    @Async
    public CompletableFuture<Map<String, String>> sendMail(String email) {
        Map<String, String> result = new HashMap<>();

        String code = mailUtil.createCode();
        if (mailUtil.sendMail(email, code)) {
            result.put("code", code);
            result.put("message", "success");
        } else {
            result.put("message", "fail");
        }

        return CompletableFuture.completedFuture(result);
    }
}
