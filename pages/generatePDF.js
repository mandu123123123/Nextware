import jsPDF from 'jspdf';
import axios from 'axios';

const generatePDF = async (userId, startDate, endDate) => {
    try {
        // 첫 번째 요청: 이름, 과정명, 시작/종료일
        const userInfoResponse = await axios.get(`/getInfo?userId=${userId}`);
        const info = userInfoResponse.data;

        // 두 번째 요청: 출석 정보
        const attendanceResponse = await axios.get(`/countSame?userId=${userId}`);
        const attendanceInfo = attendanceResponse.data;

        // 세 번째 요청: 정원 수
        const courseInfoResponse = await axios.get(`/countSame?userId=${userId}`);
        const TO = courseInfoResponse.data;

        // jsPDF를 사용해 PDF 파일 생성
        const doc = new jsPDF();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(18);
        doc.text('출석부', 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.text(`훈련기관명: 넥스트 IT`, 20, 40);
        doc.text(`소재지: 넥스트 IT`, 20, 50);
        doc.text(`훈련과정명: ${info.cohortsName}`, 20, 60);
        doc.text(`NCS(코드): 몰라`, 20, 70);

        doc.text(`성명: ${info.userName}`, 20, 90);
        // doc.text(`주민등록번호: ${userInfo.socialId.replace(/(\d{6})(\d{7})/, "$1-*******")}`, 120, 90);
        doc.text(`훈련기간: ${info.startDate} ~ ${info.endDate}`, 20, 100);

        doc.text("출석 현황", 20, 140);
        doc.text(`출석: ${attendanceInfo.attendance}`, 20, 150);
        doc.text(`결석: ${attendanceInfo.absence}`, 70, 150);
        doc.text(`지각: ${attendanceInfo.late}`, 120, 150);
        doc.text(`조퇴: ${attendanceInfo.earlyLeave}`, 170, 150);

        doc.text("위 훈련생의 훈련과정 휴석을 승인합니다.", 105, 180, null, null, "center");

        const today = new Date();
        doc.text(today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }), 150, 200);

        doc.setFontSize(14);
        // doc.text(`${userInfo.instituteName}장 (인)`, 105, 220, null, null, "center");

        // PDF 파일 저장 (다운로드)
        doc.save('출석부신청서.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

export default generatePDF;
