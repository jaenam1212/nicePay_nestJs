// payment.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';

//moment.js를 사용하여 날짜를 YYYYMMDDHHmmss 형식으로 변환하는 함수
function convertDateToCustomFormat(dateString: string) {
  return moment(dateString).format('YYYYMMDDHHmmss');
}


@Injectable()
export class PaymentService {
  constructor(private httpService: HttpService) { }

  async sendAuthRequest(data: any) {
    console.log('sendAuthRequest 호출됨', data);
    const merchantKey =
      "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";

      
    let txTid = data.TxTid;
    let authToken = data.AuthToken;
    let mid = data.MID; // MID 속성이 data 객체에 있는지 확인하세요.
    let amt = data.Amt; // Amt 속성이 data 객체에 있는지 확인하세요.
    let ediDate = data.EdiDate; // EdiDate 속성이 data 객체에 있는지 확인하세요.
    const formattedEdiDate = convertDateToCustomFormat(ediDate);
    // SHA256 해시 생성
    const signData = CryptoJS.SHA256(authToken + mid + amt + formattedEdiDate + merchantKey).toString(CryptoJS.enc.Hex);

    // URLSearchParams를 사용하여 POST 요청 본문 구성
    const formData = new URLSearchParams();
    formData.append('TID', txTid);
    formData.append('AuthToken', authToken);
    formData.append('MID', mid);
    formData.append('Amt', amt);
    formData.append('EdiDate', formattedEdiDate);
    formData.append('SignData', signData);

    console.log('결제 승인 요청 데이터:', formData.toString());

    // 요청 옵션 구성
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    try {
      // 결제 승인 요청 보내기
      const response = await lastValueFrom(this.httpService.post('https://webapi.nicepay.co.kr/webapi/pay_process.jsp', formData, options));
      console.log(`결제 승인 요청 응답:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`결제 승인 요청 에러:`, error);
      throw error;
    }
  }
}
