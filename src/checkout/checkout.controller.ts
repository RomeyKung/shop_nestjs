import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSessionRequest } from './dto/create-session.request';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('session')
  @UseGuards(JwtGuard)
  async createSession(@Body() request: CreateSessionRequest) {
    return this.checkoutService.createSession(request.productId);
  }

  @Post('webhook')
  async handleCheckoutWebhooks(@Body() event: any) {
    return this.checkoutService.handleCheckoutWebhook(event);
  }
}
