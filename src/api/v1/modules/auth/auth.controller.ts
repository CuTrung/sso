import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDTO, SignUpUserDTO } from './auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpUserDto: SignUpUserDTO) {
    return await this.authService.signUp(signUpUserDto);
  }

  @Post('sign-in')
  async signIn(@Res() res: Response, @Body() signInUserDto: SignInUserDTO) {
    const { data, status, message } = await this.authService.signIn(
      signInUserDto,
    );
    if (data) {
      const { accessToken, refreshToken } = data;
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);
    }

    return res.status(200).json({
      status,
      message,
    });
  }
}
