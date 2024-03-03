// payment.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/authReq')
  async authReq(@Body() body: any) {
    console.log('authReq 호출됨', body); 
    return await this.paymentService.sendAuthRequest(body);
  }
  @Get('/test')
  async test() {
    return 'test';
  }
}
