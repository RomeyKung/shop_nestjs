import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}
  async createSession(productId: number) {
    const product = await this.productsService.getProduct(productId);
    return this.stripe.checkout.sessions.create({
      metadata: {
        productId,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: product.price * 100,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
    });
  }

  async handleCheckoutWebhook(event: any) {
    if (event.type !== 'checkout.session.completed') {
      return;
    }
    //  ใช้ ID ของ Session ที่มากับ Event เพื่อดึงข้อมูล Session เต็มรูปแบบจาก Stripe API
    const session = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );
    if (session.metadata) {
      await this.productsService.update(parseInt(session.metadata.productId), {
        sold: true,
      });
    }
  }
}
