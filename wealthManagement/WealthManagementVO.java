package kr.or.nextit.groupware.wealthManagement;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WealthManagementVO {
    private String codeNo;//원본 관리번호
    private String codeName;
    private String productName;
    private String type;
    private String state;
    private int price;
    private LocalDate getDate;
    private String location;
    private LocalDate inspectionStart;
    private int inspectionPrice;
    private String inspectionContent;
    private String breakdownContent;
    private LocalDate inspectionEnd;

}
