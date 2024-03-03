import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
@Module({
  imports: [HttpModule],
  providers: [PaymentService], // PaymentService를 providers 배열에 추가
  controllers: [PaymentController], // PaymentController를 controllers 배열에 추가
})
export class AppModule { }
