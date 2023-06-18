import { Controller, Get } from '@nestjs/common';

@Controller({
  version: ['2023-06-18'],
})
export class AppController {
  @Get()
  test() {
    return { message: 'hello' };
  }
}
