import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @ApiOperation({
  //   summary: 'Check if the server is running',
  //   description:
  //     'This endpoint returns a "Hello, World!" message to confirm that the server is up and running.',
  // })
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  health() {
    return true;
  }
}
