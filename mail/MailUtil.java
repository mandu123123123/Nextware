package kr.or.nextit.groupware.mail;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class MailUtil {
    private final JavaMailSender javaMailSender;

    public boolean sendMail(String toEmail, String code) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            String fromName = "NextGroup"; // 발신자 이름

            helper.setSubject("[" + fromName + "] 인증번호입니다."); // 제목
            helper.setTo(toEmail); // 받는사람

            // 발신자 이메일 주소와 발신자 이름 설정
            String from = "tjsehd0612@gmail.com"; // 발신자 이메일 주소
            helper.setFrom(from, fromName);

            // HTML 본문
            String BODY = "<html>" +
                    "<head>" +
                    "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />" +
                    "    <title>이메일 인증 코드</title>" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />" +
                    "</head>" +
                    "<body>" +
                    "    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"550px\" style=\"border: 1px solid #d7d7d7; border-radius: 20px; text-align: start; font-family:'Malgun Gothic', '맑은 고딕'; letter-spacing: -0.04em; color: #333333;\">" +
                    "        <tr>" +
                    "            <td style=\"width: 40px;\"></td>" +
                    "            <td>" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"470px;\">" +
                    "                    <tr><td style=\"height: 34px;\"></td></tr>" +
                    "                    <tr><td><span style=\"font-size: 32px; font-weight: bold;\">[" + fromName + "]</span></td></tr>" +
                    "                    <tr><td><span style=\"font-size: 32px; font-weight: bold;\">비밀번호 변경 인증번호 입니다.</span></td></tr>" +
                    "                    <tr><td><span style=\"font-size: 20px;\">아래의 인증번호를 입력 후 비밀번호를 변경해주세요.</span></td></tr>" +
                    "                    <tr><td style=\"height: 34px;\"></td></tr>" +
                    "                    <tr><td style=\"height: 1px; background: #eaeaea;\"></td></tr>" +
                    "                    <tr><td style=\"height: 30px;\"></td></tr>" +
                    "                    <tr style=\"text-align: center\">" +
                    "                        <td>" +
                    "                            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"340px;\" style=\"margin: 0 auto;\">" +
                    "                                <tr>" +
                    "                                    <td>" +
                    "                                        <span style=\"font-size: 20px; font-weight: bold; \">" +
                                                                code +
                    "                                        </span>" +
                    "                                    </td>" +
                    "                                </tr>" +
                    "                                <tr><td style=\"height: 30px;\"></td></tr>" +
                    "                            </table>" +
                    "                        </td>" +
                    "                    </tr>" +
                    "                </table>" +
                    "            </td>" +
                    "            <td style=\"width: 40px;\"></td>" +
                    "        </tr>" +
                    "    </table>" +
                    "</body>" +
                    "</html>";

            helper.setText(BODY, true);

            javaMailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }


//    public boolean sendMail(String toEmail, String code) {
//        try {
//            MimeMessage message = javaMailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//            String fromName = "NextGroup"; // 발신자 이름
//
//            helper.setSubject("[" + fromName + "] 인증번호입니다."); // 제목
//            helper.setTo(toEmail); // 받는사람
//
//            // 발신자 이메일 주소와 발신자 이름 인코딩
//            String from = MimeUtility.encodeText(fromName, "UTF-8", "B") + "<tjsehd0612@gmail.com>";
//            helper.setFrom(from);
//
//            // HTML 본문
//            String BODY = "<html>" +
//                    "<head>" +
//                    "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />" +
//                    "    <title>이메일 인증번호입니다.</title>" +
//                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />" +
//                    "</head>" +
//                    "<body>" +
//                    "    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"550px\" style=\"border: 1px solid #d7d7d7; border-radius: 20px; text-align: center; font-family:'Malgun Gothic', '맑은 고딕'; letter-spacing: -0.04em; color: #333333;\">" +
//                    "        <tr>" +
//                    "            <td style=\"width: 40px;\"></td>" +
//                    "            <td>" +
//                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"470px;\">" +
//                    "                    <tr><td style=\"height: 60px;\"></td></tr>" +
//                    "                    <tr><td style=\"height: 18px;\"></td></tr>" +
//                    "                    <tr><td><span style=\"font-size: 32px; font-weight: bold;\">이메일 인증번호 입니다.</span></td></tr>" +
//                    "                    <tr><td style=\"height: 34px;\"></td></tr>" +
//                    "                    <tr><td style=\"height: 1px; background: #eaeaea;\"></td></tr>" +
//                    "                    <tr><td style=\"height: 30px;\"></td></tr>" +
//                    "                    <tr>" +
//                    "                        <td>" +
//                    "                            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"340px;\" style=\"margin: 0 auto;\">" +
//                    "                                <tr>" +
//                    "                                    <td>" +
//                    "                                        <span style=\"font-size: 14px;\">" +
//                    "                                            이메일 인증번호 : " + code +
//                    "                                        </span>" +
//                    "                                    </td>" +
//                    "                                </tr>" +
//                    "                                <tr><td style=\"height: 30px;\"></td></tr>" +
//                    "                            </table>" +
//                    "                        </td>" +
//                    "                    </tr>" +
//                    "                </table>" +
//                    "            </td>" +
//                    "            <td style=\"width: 40px;\"></td>" +
//                    "        </tr>" +
//                    "    </table>" +
//                    "</body>" +
//                    "</html>";
//
//            helper.setText(BODY, true);
//
//            javaMailSender.send(message);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//
//        return true;
//    }

    public String createCode() {
        Random random = new Random();
        int randomNumber = 100000 + random.nextInt(900000);
        return String.valueOf(randomNumber);
    }
}
